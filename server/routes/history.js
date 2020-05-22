var express = require("express");
var router = express.Router();
var request = require("request");
const jwt = require('jsonwebtoken');


const History = require("../models/history");
const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");
var PAYPAL_API = "https://api.sandbox.paypal.com";
var CLIENT =
  "AUJoKVGO3q1WA1tGgAKRdY6qx0qQNIQ6vl6D3k7y64T4qh5WozIQ7V3dl3iusw5BwXYg_T5FzLCRguP8";
var SECRET =
  "EOw8LNwDhM7esrQ3nHfzKc7xiWnJc83Eawln4YLfUgivfx1LGzu9Mj0F5wlarilXDqdK9Q5aHVo-VGjJ";

router.get("/", checkAuth, (req, res, next) => {
  console.log(req.query.isTrader + "------------=============-------------================")
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchFlowers;
  let isTrader = false;
  let user = { buyer: req.userData.userId };
  if (req.query.isTrader == "true") {
    user = { seller: req.userData.userId };
    isTrader = true;
  }

  console.log(req.query);
  console.log(user);

  History.find(user)
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize)
    .populate("flowerId buyer seller")
    .then(flowers => {
      console.log('-----------------------')
      
      fetchFlowers = flowers;
      console.log(fetchFlowers)
      return History.find(user).countDocuments();
    })
    .then(count => {
      res.status(200).json({
        flowers: fetchFlowers,
        maxFlowers: count,
        isTrader: isTrader
      });
    })
    .catch(err => {
      res.status(404).json({
        message: "You don't have a history"
      });
    });
});

router.post("/createPayment", (req, res) => {
  console.log(req.body);
  try {
    const token = req.body.jwt.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    const userData = { email: decodedToken.email, userId: decodedToken.userId };
    console.log(userData)
    User.findOne({
      email: userData.email,
      _id: userData.userId
    })
    .then(user => {
      History.findOne({
        buyer: user._id,
        _id: req.body.historyId
      }).then(history => {
        User.findById(history.seller)
        .populate("transactionDataId")
        .then(seller => {
          console.log(seller)
          request.post(
            PAYPAL_API + "/v1/payments/payment",
            {
              auth: {
                user: seller.transactionDataId.clientID,
                pass: seller.transactionDataId.secret
              },
              body: {
                intent: "sale",
                payer: {
                  payment_method: "paypal"
                },
                transactions: [
                  {
                    amount: {
                      total: ""+((history.containers * history.price)/100),
                      currency: "EUR"
                    }
                  }
                ],
                redirect_urls: {
                  return_url: "https://example.com",
                  cancel_url: "https://example.com"
                }
              },
              json: true
            },
            function(err, response) {
              if (err) {
                console.error(err);
                return res.sendStatus(500);
              }
              // 3. Return the payment ID to the client
              res.json({
                id: response.body.id
              });
            }
          );
        })
      })
    })
  } catch (error) {
    res.status(401).json({
      message: "You are not authenticated!"
    });
  }


});
router.post("/executePayment", function(req, res) {
  // 2. Get the payment ID and the payer ID from the request body.
  var paymentID = req.body.paymentID;
  var payerID = req.body.payerID;
  // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
  request.post(
    PAYPAL_API + "/v1/payments/payment/" + paymentID + "/execute",
    {
      auth: {
        user: CLIENT,
        pass: SECRET
      },
      body: {
        payer_id: payerID,
        transactions: [
          {
            amount: {
              total: "10.99",
              currency: "EUR"
            }
          }
        ]
      },
      json: true
    },
    function(err, response) {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
      // 4. Return a success response to the client
      res.json({
        status: "success"
      });
    }
  );
});

module.exports = router;
