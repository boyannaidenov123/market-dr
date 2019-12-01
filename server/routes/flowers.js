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
    console.log(flower)
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

router.get('/', checkAuth, (req, res, next)=>{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const productQuery = Flower.find();
    let fetchedProducts;

    if(pageSize && currentPage){
        productQuery
        .skip(pageSize * (currentPage-1))
        .limit(pageSize)
    }
    productQuery
    .then(flowers =>{
        fetchedProducts = flowers;
        return Flower.count();
    }).then(count =>{
        res.status(200).json({
            message:"Products fetch successfully",
            products: fetchedProducts,
            maxProducts: count
        });
    });
});

module.exports = router;