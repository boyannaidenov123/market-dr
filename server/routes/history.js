var express = require("express");
var router = express.Router();
const User = require("../models/user");
const History = require("../models/history");
const Flower = require("../models/flower");
const checkAuth = require("../middleware/check-auth");
const bcrypt = require("bcrypt");

router.get("/buyerHistory", checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchFlowers;

  History.find({ buyer: req.userData.userId })
  .skip(pageSize * (currentPage - 1))
  .limit(pageSize)
  .populate('flowerId')
  .populate('seller', 'email')
  .then(flowers => {
    fetchFlowers = flowers;
    return  History.find({ buyer: req.userData.userId }).countDocuments;
  })
  .then(count => {
    if (count == 0) {
      return res.status(404).json({
        message: "Not Found"
      });
    }
    res.status(200).json({
      flowers: fetchFlowers,
      maxFlowers: count
    });
  });
});

module.exports = router;
