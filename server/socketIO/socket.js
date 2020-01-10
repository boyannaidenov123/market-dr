const Auction = require("../models/auction");
const Lot = require("../models/lot");
const Flower = require("../models/flower");
const User = require("../models/user");
const { performance } = require("perf_hooks");

let timer; //variable for setInterval
let value; //blocks of the clock
let lotForSellInfo; //all info for lot which is for selling
let flowerForSaleInfo; //all info for flower which is for selling
let auctionStart = false; //boolean => is Auction started
let countUsers = 0; //count of connecting users
let countOfNoSelling = 0; //count of no selling
let countOfLotsForSelling = 0; //count of lot For Selling
let waitBeforeStarting; //variable for setTimeout
let canBuy = false;

function clockMovement(io, lotId, price) {
  canBuy = true;
  value = price;

  timer = setInterval(() => {
    console.log(value);
    io.emit("clockValue", { value: value });
    Lot.updateOne(
      { _id: lotId },
      { currentPrice: value - 1 }
    ).then(result => {});

    if (value > 10 && countOfNoSelling < 3) {
      value -= 1;
    }
    if (value <= 10 && countOfNoSelling < 3) {
      countOfNoSelling++;
      clearInterval(timer);
      waitBeforeStarting = setTimeout(() => {
        console.log("tuk--------------------");
        clockMovement(io, lotId, 90);
      }, 2000);
    }
    if (countOfNoSelling == 3) {
      canBuy = false;
      Lot.updateOne({ _id: lotId }, { "status.scheduledState": true }).then(
        () => {
          asdf(io);
        }
      );
      countOfNoSelling = 0;
      console.log("ne se prodade");
      clearInterval(timer);
      clearTimeout(waitBeforeStarting);
      console.log("sledva6t LOT , -------finished");
    }
  }, 2000);
}
function start(io) {
  io.on("connection", socket => {
    console.log("----------------------Client Connected----------------------");
    countUsers++;
    io.emit("countUsers", { countUsers: countUsers });
    socket.on("disconnect", function() {
      console.log("User disconnected");
      countUsers--;
      io.emit("countUsers", { countUsers: countUsers });
    });
    socket.on('forceDisconnect', function(){
      socket.disconnect();
  });

    if (auctionStart) {
      io.emit("lotForSale", lotForSellInfo);
      io.emit("flowerForSale", flowerForSaleInfo);
    }

    socket.on("buyLot", function(data) {
      if (canBuy) {
        console.log("buy----------");
        canBuy = false;
        clearInterval(timer);
        console.log(data); //_id na buyer; containers buying;
        countOfNoSelling = 0;
        flowerForSaleInfo.containers -= data.containers;

        if (flowerForSaleInfo.containers < 0) {
          data.containers += flowerForSaleInfo.containers;
          flowerForSaleInfo.containers = 0;
          Lot.findByIdAndUpdate(lotForSellInfo._id, {
            "status.sold": true
          }).then(() => {
            setTimeout(() => {
              asdf(io);
            }, 2000);
          });
        }
        Flower.findByIdAndUpdate(flowerForSaleInfo._id, {
          containers: flowerForSaleInfo.containers
        }).then(() => {});

        User.updateOne(
          { _id: data.userId },
          {
            $push: {
              "history.date": new Date(),
              "history.lotId": lotForSellInfo._id,
              "history.containers": data.containers,
              "history.flowerId": flowerForSaleInfo._id,
              "history.price": (value + 1) * flowerForSaleInfo.blockPrice
            }
          }
        )
          .then(result => {
            console.log("buyer history saved");
            if (flowerForSaleInfo.containers > 0) {
              setTimeout(() => {
                asdf(io);
              }, 2000);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  });
}

function startClock(io) {
  console.log("---------------New Lot--------------------");
  Lot.findOne({
    //get lot for selling
    auctionName: "Sofia",
    "status.scheduledState": false,
    "status.sold": false
  })
    .then(lot => {
      lotForSellInfo = lot;
      io.emit("lotForSale", lot);
      Flower.findById({ _id: lot.flowerId }).then(flower => {
        io.emit("flowerForSale", flower);
        flowerForSaleInfo = flower;
      });
      clockMovement(io, lot._id, lot.currentPrice); //start selling
    })
    .catch(err => {
      console.log("error");
    });
}
function asdf(io) {
  Lot.countDocuments({
    auctionName: "Sofia",
    "status.scheduledState": false,
    "status.sold": false
  }).then(count => {
    {
      console.log("Lots for sale: " + count);
      if (count > 0) {
        auctionStart = true;
        startClock(io);
      } else {
        auctionStart = false;
        canBuy = false;
        console.log("krai--------------------------------");
      }
    }
  });
}

module.exports = {
  startConnection: function(io) {
    start(io);
  },
  startClockIO: function(io) {
    asdf(io);
  }
};
