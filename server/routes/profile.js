var express = require("express");
var router = express.Router();
const User = require("../models/user");
const Transaction = require("../models/transactionData");
const checkAuth = require("../middleware/check-auth");
const bcrypt = require("bcrypt");

router.get("/info", checkAuth, (req, res) => {
  User.findById(req.userData.userId).then((user) => {
    if (!user) {
      res.status(404).json({
        message: "User does't exist",
      });
    }
    res.status(200).json({
      email: user.email,
      name: user.name,
      isTrader: user.isTrader,
    });
  });
});

router.put("/changeName", checkAuth, (req, res) => {
  User.updateOne(
    {
      _id: req.userData.userId,
    },
    {
      name: req.body.name,
    }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({
        message: "Update successful",
        name: req.body.name,
      });
    } else {
      res.status(401).json({
        message: "Not authorized",
      });
    }
  });
});

router.put("/changePassword", checkAuth, (req, res) => {
  User.findById({ _id: req.userData.userId })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid authentication credentials!",
        });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid authentication credentials!",
        });
      }
      bcrypt.hash(req.body.newPassword, 10).then((hash) => {
        User.updateOne(
          {
            _id: req.userData.userId,
          },
          {
            password: hash,
          }
        ).then((result) => {
          if (result.nModified > 0) {
            res.status(200).json({
              message: "Update successful",
            });
          } else {
            res.status(401).json({
              message: "Password is not update",
            });
          }
        });
      });
    });
});

router.put("/paypalAccount", checkAuth, (req, res, next) => {
  User.findById(req.userData.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "Invalid authentication credentials!",
        });
      }
      if (user.isTrader) {
        Transaction.updateOne(
          { _id: user.transactionDataId },
          { clientID: req.body.clientID, secret: req.body.secret }
        ).then((result) => {
          if (result.nModified > 0) {
            return res.status(200).json({
              message: "PayPay information is saved successfully",
            });
          }
          return res.status(401).json({
            message: "Updating the PayPay information has failed!",
          });
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
      });
    });
});

module.exports = router;
