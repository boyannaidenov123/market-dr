var express = require("express");
var router = express.Router();
const User = require("../models/user");
const Transaction = require("../models/transactionData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const configName = require("../functions/configName");

/*Sign up*/
router.post("/signup", (req, res) => {
  let user, transaction;

  let name = configName(req.body.isTrader);
  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      transaction = new Transaction({
        clientID: "",
        secret: ""
      });
      transaction.save().then(transactionData => {
        user = new User({
          email: req.body.email,
          name: name,
          password: hash,
          isTrader: req.body.isTrader,
          authenticated: false,
          transactionDataId: transactionData._id
        });

        user
          .save()
          .then(result => {
            result.sendConfirmationCode();
            res.status(201).json({
              message: "User created",
              user: result,
              signup: true
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err
            });
          });
      });
    })
    .catch(error => {
      res.status(500).json({
        error: "Invalid authentication credentials!"
      });
    });
});

router.post("/access", (req, res) => {
  let code = req.body.code;
  console.log('---------------' + code);
  console.log(req.body.email);
  User.findOne({ email: req.body.email }).then(user => {
    user.getAccess(code, function(callback) {
      if (callback) {
        res.status(200).json({
          message: "Profile created",
          signup: true
        });
      } else {
        res.status(404).json({
          message: "Invalid confirmation code",
          signup: false
        });
      }
    });
  });
});

router.post("/login", (req, res) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email,
    authenticated: true
  })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid authentication credentials"
        });
      }
      fetchedUser = user;
      console.log("Tursq user");
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid authentication credentials"
        });
      }
      console.log("Ima user");
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "24h" }
      );

      res.status(200).json({
        token: token,
        expiresIn: 86400,
        userId: fetchedUser._id,
        isAdmin: fetchedUser.admin
      });
    })
    .catch(() => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
});
router.get('/isAuthenticated', (req, res)=>{
  let fetchedUser;
  User.findOne({
    email: req.query.email,
  }).then(user => {
    console.log("Tursq")
        if (!user) {
          console.log("nqma")
          return res.status(401).json({
            message: "Invalid authentication credentials"
          });
        }
        fetchedUser = user;
        console.log(fetchedUser);
        console.log("Tursq user");
        return bcrypt.compare(req.query.password, user.password);
      })
      .then(result => {
        if (!result) {
          return res.status(401).json({
            message: "Invalid authentication credentials"
          });
        }
        return res.status(200).json({
          isPofileAuth: fetchedUser.authenticated
        })
  })
})

router.get("/isTrader", checkAuth, (req, res) => {
  console.log("tuk");
  User.findOne({
    _id: req.userData.userId,
    email: req.userData.email
  }).then(user => {
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    console.log(user);
    res.status(200).json({
      isTrader: user.isTrader
    });
  });
});

router.get("/isAdmin", checkAuth, (req, res) => {
  console.log("asdfsadf-------------------------");
  User.findOne({
    _id: req.userData.userId,
    email: req.userData.email,
    admin: true
  })
    .then(user => {
      res.status(200).json({
        isAdmin: user.admin
      });
    })
    .catch(error => {
      return res.status(200).json({
        message: "User not found"
      });
    });
});

module.exports = router;
