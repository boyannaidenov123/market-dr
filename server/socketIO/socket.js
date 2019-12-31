const Auction = require('../models/auction');
const Lot = require('../models/lot');
const { performance } = require('perf_hooks');

let timer, value, lotForSellInfo, auctionStart = 0, countUsers=0;

function clockMovement(io, lotId, price) {
    value = price;

    
    timer = setInterval(() =>{
        console.log(value);
        io.emit('clockValue', {value: value});
        Lot.updateOne({ _id:lotId}, {currentPrice: (value-1)}).then(result => {})
        
        if(value > 0){
            value -= 1;
        }
        else{
            clearInterval(timer);
        }
    }, 150);
}

module.exports = {
    startConnection: function(io){
        io.on('connection', (socket) => {
            countUsers++;
            io.emit('countUsers', {countUsers: countUsers});
            if(auctionStart){
               io.emit('lotForSale', lotForSellInfo);
            }
            
            console.log("----------------------Client Connected----------------------");
            socket.on('disconnect', function(){
                console.log('User disconnected');
                countUsers--;
                io.emit('countUsers', {countUsers: countUsers});
            })
            socket.on('buyLot', function(data){
                console.log(data);//_id na Lot i _id na buyer:User
                value = 100;
                //Lot.updateOne({_id: data._id}, {})
            })
        });
    },
    startClockIO: function (io) {
            auctionStart = 1;
            let lotNumber;
           
            Auction.findOne({name:"Sofia"})     // performance time ~ 0.1-0.15s
            .then(result =>{
                lotNumber = result.lotForSale;  // get which lot is for sale
                console.log("1. "+lotNumber)
                var t0 = performance.now();
                Lot                             // 0.3-0.7s, get lot for sale
                .findOne({auctionName: "Sofia", 'status.scheduledState':false, 'status.sold':false})
                .then(result =>{
                    lotForSellInfo = result;
                    var t1 = performance.now();
                    console.log("2. "+(t1-t0));
                    console.log(result)
                    io.emit('lotForSale', result);
                    clockMovement(io, result._id, result.currentPrice);
                })

            })


    },
    print: function(){
        console.log("baca ve")
    }
}