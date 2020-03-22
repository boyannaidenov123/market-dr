const Lot = require("../models/lot");
const Flower = require("../models/flower");
const History = require("../models/history");
const Auction = require("../models/auction");


let timer; //variable for setInterval
let value; //blocks of the clock
let lotForSaleInfo; //all info for lot which is for selling
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
    //io.emit("clockValueVarna", { value: value });
    sendLotInfo(io, lotForSaleInfo, flowerForSaleInfo);
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
        clockMovement(io, lotId, (value+40));
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
  }, 100);
}
function start(io, socket) {
    console.log('start connection')
    if (auctionStart) {
      sendLotInfo(io, lotForSaleInfo, flowerForSaleInfo);
    }

    socket.on("buyLotVarna", function(data) {
      if (canBuy) {
        console.log("buy----------");
        canBuy = false;
        clearInterval(timer);
        socket.emit("boughtVarna", {});

        console.log(data); //_id na buyer; containers buying;
        countOfNoSelling = 0;
        lotForSaleInfo.containers -= data.containers;
        if (lotForSaleInfo.containers > 0) {
          sendLotInfo(io, lotForSaleInfo, flowerForSaleInfo);
        }
        else{
          data.containers += lotForSaleInfo.containers;
          lotForSaleInfo.containers = 0;
          Lot.findByIdAndUpdate(lotForSaleInfo._id, {
            "status.sold": true
          }).then(() => {
            setTimeout(() => {
              getCountOfLots(io);
            }, 2000);
          });
        }
        Lot.findByIdAndUpdate(lotForSaleInfo._id, {
          containers: lotForSaleInfo.containers
        }).then(result => {
          const history = new History({
            flowerId: flowerForSaleInfo._id,
            buyer: data.userId,
            seller: result.seller,
            date: new Date(),
            containers: data.containers,
            price: (value) * flowerForSaleInfo.blockPrice,
            auctionName: lotForSaleInfo.auctionName
          });
          history
            .save()
            .then(() => {
              console.log("history saved");
              if (lotForSaleInfo.containers > 0) {
                setTimeout(() => {
                  clockMovement(io, lotForSaleInfo._id, (value+40));
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

function sendLotInfo(io, lot, flower){
  io.emit("lotForSaleVarna",{
    name: flower.name,
    type: flower.type,
    itemsInContainer: flower.itemsInContainer,
    height: flower.height,
    weight: flower.weight,
    blockPrice: flower.blockPrice,
    auctionName: lot.auctionName,
    additionalInformation: flower.additionalInformation,
    currentPrice: value,
    _id: lot._id,
    containers: lot.containers,
    imagePath: flower.imagePath
  })
}


function startClock(io) {
  console.log("---------------New Lot--------------------");
  Lot.findOne({
    //get lot for selling
    auctionName: "Varna",
    "status.scheduledState": false,
    "status.sold": false
  })
    .then(lot => {
      lotForSaleInfo = lot;
      Flower.findById({ _id: lot.flowerId }).then(flower => {
        flowerForSaleInfo = flower;
        sendLotInfo(io, lotForSaleInfo, flowerForSaleInfo);
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
    auctionName: "Varna",
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
        value = 100;

        Auction.updateOne({name: "Varna"}, {active: false, startDate: new Date(new Date().setHours(new Date().getHours() + 24))})
        .then((result)=>{
          if(result.nModified > 0){
            console.log("New date is set");
          }
          else{
            console.log("Can't set new date");
          }
        });
        Lot.updateMany({
          auctionName: "Varna",
          "status.scheduledState": true,
          "status.sold": false
        }, {
          "status.scheduledState": false,
          currentPrice: 100
        }).then(result => {
          if(result.nModified > 0){
            console.log('status.scheduledState sa promeneni na false !!!');
          }
          else{
            console.log('nqma neprodadeni !!!')
          }
        })

        io.emit("endVarna", {});
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
    Auction.findOne({name: "Varna"})
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
