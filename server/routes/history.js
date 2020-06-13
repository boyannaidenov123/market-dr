var express = require("express");
var router = express.Router();
var request = require("request");
const jwt = require("jsonwebtoken");

const History = require("../models/history");
const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");
var PAYPAL_API = "https://api.sandbox.paypal.com";

router.get("/", checkAuth, (req, res, next) => {
  console.log(
    req.query.isTrader +
      "------------=============-------------================"
  );
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchFlowers;
  let isTrader = false;
  let user = { buyer: req.userData.userId };
  if (req.query.isTrader == "true") {
    user = { seller: req.userData.userId };
    isTrader = true;
  }

  History.find(user)
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .populate("flowerId buyer seller")
    .then((flowers) => {
      fetchFlowers = flowers;
      return History.find(user).countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        flowers: fetchFlowers,
        maxFlowers: count,
        isTrader: isTrader,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "You don't have a history",
      });
    });
});

router.post("/createPayment", (req, res) => {
  try {
    const token = req.body.jwt.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    const userData = { email: decodedToken.email, userId: decodedToken.userId };
    User.findOne({
      email: userData.email,
      _id: userData.userId,
    }).then((user) => {
      History.findOne({
        buyer: user._id,
        _id: req.body.historyId,
      }).then((history) => {
        User.findById(history.seller)
          .populate("transactionDataId")
          .then((seller) => {
            request.post(
              PAYPAL_API + "/v1/payments/payment",
              {
                auth: {
                  user: seller.transactionDataId.clientID,
                  pass: seller.transactionDataId.secret,
                },
                body: {
                  intent: "sale",
                  payer: {
                    payment_method: "paypal",
                  },
                  transactions: [
                    {
                      amount: {
                        total: "" + (history.containers * history.price) / 100,
                        currency: "EUR",
                      },
                    },
                  ],
                  redirect_urls: {
                    return_url: "https://example.com",
                    cancel_url: "https://example.com",
                  },
                },
                json: true,
              },
              function (err, response) {
                if (err) {
                  console.error(err);
                  return res.sendStatus(500);
                }
                // 3. Return the payment ID to the client
                res.json({
                  id: response.body.id,
                });
              }
            );
          });
      });
    });
  } catch (error) {
    res.status(401).json({
      message: "You are not authenticated!",
    });
  }
});
router.post("/executePayment", function (req, res) {
  // 2. Get the payment ID and the payer ID from the request body.
  var paymentID = req.body.paymentID;
  var payerID = req.body.payerID;
  const token = req.body.jwt.split(" ")[1];
  const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
  const userData = { email: decodedToken.email, userId: decodedToken.userId };
  User.findOne({
    email: userData.email,
    _id: userData.userId,
  }).then((user) => {
    History.findOne({
      buyer: user._id,
      _id: req.body.historyId,
    }).then((history) => {
      User.findById(history.seller)
        .populate("transactionDataId")
        .then((seller) => {
          request.post(
            PAYPAL_API + "/v1/payments/payment/" + paymentID + "/execute",
            {
              auth: {
                user: seller.transactionDataId.clientID,
                pass: seller.transactionDataId.secret,
              },
              body: {
                payer_id: payerID,
                transactions: [
                  {
                    amount: {
                      total: "" + (history.containers * history.price) / 100,
                      currency: "EUR",
                    },
                  },
                ],
              },
              json: true,
            },
            function (err, response) {
              if (err) {
                console.error(err);
                return res.sendStatus(500);
              }
              History.findOneAndUpdate(
                {
                  buyer: user._id,
                  _id: req.body.historyId,
                },
                {
                  transaction: true,
                }
              ).then((result) => {
                if (result.nModified > 0) {
                  console.log("update payment history");
                }
              });
              // 4. Return a success response to the client
              res.json({
                status: "success",
              });
            }
          );
        });
    });
  });
  // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
});

module.exports = router;
