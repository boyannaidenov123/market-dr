var express = require('express');
var router = express.Router();
const User = require('../models/user');
const checkAuth = require('../middleware/check-auth');


router.get('/info', checkAuth, (req, res, next)=>{
  User.findById(req.userData.userId)
  .then(user =>{
    if(!user){
      res.status(404).json({
        message:'Not found'
      })
    }
    console.log(user)
    res.status(200).json({
      email:user.email,
      name: user.name,
      isTrader: user.isTrader
    })
  })
})

router.post('/changeName', checkAuth, (req, res, next)=>{
  console.log(req.body);
  User.updateOne({
    _id: req.userData.userId
  }, {
    name: req.body.name
  }).then(result =>{
    if(result.nModified > 0){
      res.status(200).json({
        message: "Update successful",
        name: req.body.name
      })
    }else{
      res.status(401).json({
        message: "Not authorized"
      })
    }
  })
})

module.exports = router;