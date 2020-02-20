const CronJob = require('cron').CronJob;
const Auction = require('../models/auction');
const {performance} = require('perf_hooks');
const socket  = require('../socketIO/socket');
var IO;

const auction = new CronJob('00 52 03 * * *', function() {
	const d = new Date();
    console.log('Date: ', d);
    
    Auction.updateOne({name:"Sofia"}, {active:true})
    .then(result =>{
        //Auction is starting
        //Start SocketIO communication
        socket.startClockIO(IO);
    }).catch(err =>{

    })

});

module.exports = function(io){
    IO = io;
    console.log('Before job instantiation');
    console.log('After job instantiation');
    auction.start();
}

