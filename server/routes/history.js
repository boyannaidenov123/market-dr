var express = require("express");
var router = express.Router();
const History = require("../models/history");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchFlowers;
  let user = {buyer: req.userData.userId};
  if(req.query.isTrader){
    user = {seller: req.userData.userId};
  }

  History.find(user)
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .populate("flowerId seller buyer")
    .then(flowers => {
      fetchFlowers = flowers;
      return History.find(user).countDocuments();
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
