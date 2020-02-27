const CronJob = require("cron").CronJob;
const Auction = require("../models/auction");
const Sofia = require("../socketIO/startSofiaClockIO");
const Plovdiv = require("../socketIO/startPlovdivClockIO");
const Varna = require("../socketIO/startVarnaClockIO");
var IO;

module.exports = function(io, auction, date) {
  try {
    if(io != null) {
      IO = io;
    }
    const cron = new CronJob(date, function() {
      const d = new Date();
      console.log("Date: " + d + "--------------------");

      Auction.updateOne({name: auction}, {active:false})
        .then(() =>{
            if(auction === "Sofia"){
                Sofia.startClockIO(IO);
            }
            else if(auction === "Plovdiv"){
                Plovdiv.startClockIO(IO);
            }
            else if(auction === "Varna"){
                Varna.startClockIO(IO);
            }
            else{
                throw new Error('Invalid');
            }
        }).catch(() =>{
    
        })
    });
    cron.start();
  } catch (err) {
    console.log("bozaaaaaaaaa");
  }
};
