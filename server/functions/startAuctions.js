const cron = require("./cron");
const Auction = require("../models/auction");

module.exports = function (io) {
  console.log("Before job instantiation");
  console.log("After job instantiation");

  Auction.findOne({ name: "Sofia" }).then((auction) => {
    cron(io, auction.name, auction.startDate);
  });
  Auction.findOne({ name: "Plovdiv" }).then((auction) => {
    cron(io, auction.name, auction.startDate);
  });
  Auction.findOne({ name: "Varna" }).then((auction) => {
    cron(io, auction.name, auction.startDate);
  });
};
