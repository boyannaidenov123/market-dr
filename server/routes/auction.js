var express = require("express");
var router = express.Router();
var Auction = require("../models/auction");
const checkAuth = require("../middleware/check-auth");
const checkAdmin = require("../middleware/check-admin");
const cron = require("../functions/cron");

router.get("/", checkAuth, (req, res) => {
  Auction.findOne({
    name: req.query.auction
  }).then(result => {
    res.status(200).json({
      activate: result.active,
      startTime: result.startDate
    });
  });
});

router.put("/", checkAdmin, (req, res)=>{
  if(new Date(req.body.date).getTime() <= new Date().getTime()){
    return res.status(422).json({
      message: "Unprocessable Entity!"
    });
  }
  Auction.updateOne(
    {
      name: req.body.auction
    },{
      startDate: req.body.date,
      active: false
    }
    
  ).then(result => {
    if (result.nModified > 0) {
      Auction.findOne({ name: req.body.auction }).then(() => {
        console.log("start cron");
        cron(null, req.body.auction, req.body.date);
      });
      res.status(200).json({
        message: "Update successful!"
      });
    } else {
      res.status(401).json({
        message: "Not authorized!"
      });
    }
  }).catch(function (err) {
    console.log(err)
  })
})

module.exports = router;
