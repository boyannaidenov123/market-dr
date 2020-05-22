const CronJob = require("cron").CronJob;
const Auction = require("../models/auction");
const Sofia = require("../socketIO/startSofiaClockIO");
const Plovdiv = require("../socketIO/startPlovdivClockIO");
const Varna = require("../socketIO/startVarnaClockIO");
var IO;

module.exports = function (io, auction, date) {
  try {
    if (io != null) {
      IO = io;
    }
    const cron = new CronJob(new Date(date), function () {
      const d = new Date();
      console.log("Date: " + d + "--------------------cron.js");
      Auction.updateOne({ name: auction }, { active: true })
        .then(() => {
          if (auction === "Sofia") {
            Sofia.startClockIO(IO);
          }
          else if (auction === "Plovdiv") {
            Plovdiv.startClockIO(IO);
          }
          else if (auction === "Varna") {
            Varna.startClockIO(IO);
          }
          else {
            throw new Error('Invalid');
          }
        }).catch(() => {

        })
    }, null, true, 'Europe/Sofia');
    cron.start();
  } catch (err) {
    console.log("don't starting cron");
  }
};
