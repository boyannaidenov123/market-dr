var express = require('express');
var router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const configName = require('../functions/configName');


/*Sign up*/
router.post('/signup', (req, res, next) => {
  let user;

  let name = configName(req.body.isTrader);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      user = new User({
        email: req.body.email,
        name:name,
        password: hash,
        isTrader: req.body.isTrader,
        admin: true
      })

      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            user: result,
            signup: true
          })
        }).catch(err => {
          res.status(500).json({
            error: err
          })
        })
    });
});

router.post('/login', (req, res, next) =>{
  let fetchedUser;
  User.findOne({email: req.body.email, isTrader:req.body.isTrader})
  .then(user => {
    if(!user){
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    fetchedUser = user;
    console.log("Tursq user");
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result){
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    console.log("Ima user");
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
      'secret_this_should_be_longer',
      {expiresIn: "24h"}
    )

    res.status(200).json({
      token: token,
      expiresIn: 86400,
      userId: fetchedUser._id,
      isAdmin: fetchedUser.admin
    })

  })
});

router.get('/isTrader', checkAuth, (req, res, next)=>{
  console.log("tuk")
  User.findOne({
    _id: req.userData.userId,
    email: req.userData.email
  }).then(user =>{
    if(!user){
      return res.status(404).json({
        message: "User not found"
      })
    }
    console.log(user)
    res.status(200).json({
      isTrader: user.isTrader
    })
  })
})

router.get('/isAdmin', checkAuth, (req, res, next)=>{
  console.log('asdfsadf-------------------------')
  User.findOne({
    _id: req.userData.userId,
    email: req.userData.email
  }).then(user=>{
    console.log('asdfsadf-------------------------')

    if(!user || !user.admin){
      return res.status(404).json({
        message: "User not found"
      })
    }
    res.status(200).json({
      isAdmin: user.admin
    })
  })
})


module.exports = router;
