const Lot = require("../models/lot");
const Flower = require("../models/flower");
const History = require("../models/history");
const Auction = require("../models/auction");


let timer; //variable for setInterval
let value; //blocks of the clock
let lotForSellInfo; //all info for lot which is for selling
let flowerForSaleInfo; //all info for flower which is for selling
let auctionStart = false; //boolean => is Auction started
let countOfNoSelling = 0; //count of no selling
let waitBeforeStarting; //variable for setTimeout
let canBuy = false;

function clockMovement(io, lotId, price) {
  canBuy = true;
  value = price;

  timer = setInterval(() => {
    console.log(value);
    io.emit("clockValueSofia", { value: value });
    Lot.updateOne({ _id: lotId }, { currentPrice: value - 1 }).then(() => {});

    if (value >= 10 && countOfNoSelling < 3) {
      value -= 1;
    }
    if (value < 10 && countOfNoSelling < 3) {
      canBuy = false;
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
          getCountOfLots(io);
        }
      );
      countOfNoSelling = 0;
      console.log("ne se prodade");
      clearInterval(timer);
      clearTimeout(waitBeforeStarting);
      console.log("sledva6t LOT , -------finished");
    }
  }, 150);
}
function start(io, socket) {
    console.log('start connection')
    if (auctionStart) {
      io.emit("lotForSaleSofia", lotForSellInfo);
      io.emit("flowerForSaleSofia", flowerForSaleInfo);
    }

    socket.on("buyLotSofia", function(data) {
      if (canBuy) {
        console.log("buy----------");
        canBuy = false;
        clearInterval(timer);
        socket.emit("boughtSofia", {});

        console.log(data); //_id na buyer; containers buying;
        countOfNoSelling = 0;
        flowerForSaleInfo.containers -= data.containers;
        io.emit("flowerForSaleSofia", flowerForSaleInfo);
        if (flowerForSaleInfo.containers < 0) {
          data.containers += flowerForSaleInfo.containers;
          flowerForSaleInfo.containers = 0;
          Lot.findByIdAndUpdate(lotForSellInfo._id, {
            "status.sold": true
          }).then(() => {
            setTimeout(() => {
              getCountOfLots(io);
            }, 2000);
          });
        }
        Flower.findByIdAndUpdate(flowerForSaleInfo._id, {
          containers: flowerForSaleInfo.containers
        }).then(result => {
          const history = new History({
            flowerId: flowerForSaleInfo._id,
            buyer: data.userId,
            seller: result.seller,
            date: new Date(),
            containers: data.containers,
            price: (value + 1) * flowerForSaleInfo.blockPrice
          });
          history
            .save()
            .then(() => {
              console.log("history saved");
              if (flowerForSaleInfo.containers > 0) {
                setTimeout(() => {
                  clockMovement(io, lotForSellInfo._id, 90);
                }, 2000);
              }
            })
            .catch(err => {
              console.log(err);
            });
        });


      }
    });
  };


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
      io.emit("lotForSaleSofia", lot);
      Flower.findById({ _id: lot.flowerId }).then(flower => {
        io.emit("flowerForSaleSofia", flower);
        flowerForSaleInfo = flower;
      });
      setTimeout(() => {
        clockMovement(io, lot._id, lot.currentPrice); //start selling
      }, 2000);
    })
    .catch(() => {
      console.log("error");
    });
}
function getCountOfLots(io) {
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
  startConnection: function(io, socket) {
    start(io, socket);
  },
  startClockIO: function(io) {
    Auction.findOne({name: "Sofia"})
    .then(result => {
      if(result.startDate.getFullYear() == new Date().getFullYear() 
      && result.startDate.getMonth() == new Date().getMonth()
      && result.startDate.getDate() == new Date().getDate()
      && result.startDate.getHours() == new Date().getHours()
      && result.startDate.getMinutes() == new Date().getMinutes()){
        console.log("start");
        console.log(result.startDate, new Date())
        getCountOfLots(io);
      }else{
        console.log("stop");
        return;
      }
    });
    
  }
};
