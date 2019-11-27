var express = require('express');
var router = express.Router();
const Flower = require('../models/flower');
const checkAuth = require('../middleware/check-auth');

router.post('/newFlower', checkAuth, (req, res, next)=>{
    const flower = new Flower({
        seller: req.userData.userId,
        name: req.body.name,
        type: req.body.type,
        count: +req.body.count,
        price: +req.body.price,
        min: +req.body.min,
        image: req.body.image
    });
    flower.save().then(createFlower =>{
        res.status(201).json({
            message: "Flower added successfully",
            flower: {
                ...createFlower,
                id: createFlower._id
            }
        })
    })
})

router.get('/getFlowers', checkAuth, (req, res, next)=>{
    Flower.find()
    .then(flowers =>{
        if(!flowers){
            return res.status(404).json({
                message:"Not found"
            })
        }
        res.status(200).json({
            flowers:flowers
        })
    })
})

module.exports = router;