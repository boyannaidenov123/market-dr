var express = require("express");
var router = express.Router();
const User = require("../models/user");
const History = require("../models/history");
const Flower = require("../models/flower");
const checkAuth = require("../middleware/check-auth");
const bcrypt = require("bcrypt");

router.get("/info", checkAuth, (req, res, next) => {
  User.findById(req.userData.userId).then(user => {
    if (!user) {
      res.status(404).json({
        message: "User does't exist"
      });
    }
    console.log(user);
    res.status(200).json({
      email: user.email,
      name: user.name,
      isTrader: user.isTrader
    });
  });
});

router.put("/changeName", checkAuth, (req, res, next) => {
  console.log(req.body);
  User.updateOne(
    {
      _id: req.userData.userId
    },
    {
      name: req.body.name
    }
  ).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({
        message: "Update successful",
        name: req.body.name
      });
    } else {
      res.status(401).json({
        message: "Not authorized"
      });
    }
  });
});
router.put("/changePassword", checkAuth, (req, res, next) => {
  User.findById({ _id: req.userData.userId })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      }
      console.log("Suvpada");
      console.log(req.body.newPassword);
      bcrypt.hash(req.body.newPassword, 10).then(hash => {
        User.updateOne(
          {
            _id: req.userData.userId
          },
          {
            password: hash
          }
        ).then(result => {
          if (result.nModified > 0) {
            res.status(200).json({
              message: "Update successful"
            });
          } else {
            res.status(401).json({
              message: "Password is not update"
            });
          }
        });
      });
    });
});

module.exports = router;
