var express = require('express');
var router = express.Router();
const Flower = require('../models/flower');
const checkAuth = require('../middleware/check-auth');

router.post('/newFlower', checkAuth, (req, res, next)=>{
    const flower = new Flower({
        seller: req.userData.userId,
        name: req.body.name,
        type: req.body.type,
        containers: +req.body.containers,
        itemsInContainer: +req.body.itemsInContainer,
        height: req.body.height,
        weight: req.body.weight,
        price: +req.body.price,
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
    const selected = +req.query.selected;

    const productQuery = Flower.find();
    let fetchedProducts;

    if(pageSize && currentPage){
        if(selected == 2){// "Yours" products
            productQuery
            .find({seller: req.userData.userId})
            .skip(pageSize * (currentPage-1))
            .limit(pageSize)
            
        }else{
            productQuery
            .skip(pageSize * (currentPage-1))
            .limit(pageSize)            
        }
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