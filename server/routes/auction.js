var express = require("express");
var router = express.Router();
var Auction = require("../models/auction");
const checkAuth = require("../middleware/check-auth");

router.post("/", (req, res, next) => {
  console.log("asdf");
  const event = new Date("December 27, 2019 10:00:00");
  const city = new Auction({
    name: "Sofia",
    active: false,
    startDate: event
  });
  city
    .save()
    .then(result => {
      res.status(201).json({
        message: "User created"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get("/", checkAuth, (req, res, next) => {
  Auction.findOne({
    name: "Sofia"
  }).then(result => {
    res.status(200).json({
      activate: result.active,
      startTime: result.startDate
    });
  });
});

module.exports = router;