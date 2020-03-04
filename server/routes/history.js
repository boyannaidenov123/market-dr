var express = require("express");
var router = express.Router();
const History = require("../models/history");
const checkAuth = require("../middleware/check-auth");

router.get("/buyerHistory", checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchFlowers;

  if (pageSize && currentPage) {
    History.find()
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  History.find({ buyer: req.userData.userId })
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .populate("flowerId")
    .populate("seller", "email")
    .then(flowers => {
      fetchFlowers = flowers;
      return History.find({ buyer: req.userData.userId }).countDocuments();
    })
    .then(count => {
      res.status(200).json({
        flowers: fetchFlowers,
        maxFlowers: count
      });
    }).catch(err =>{
      res.status(404).json({
        message: "You don't have a history"
      })
    })
});

module.exports = router;
