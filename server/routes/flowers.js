var express = require('express');
var router = express.Router();
const Flower = require('../models/flower');
const Lot = require('../models/lot');
const checkAuth = require('../middleware/check-auth');

router.post('/newFlower', checkAuth, (req, res, next)=>{
    const flower = new Flower({
        seller: req.userData.userId,
        name: req.body.name,
        type: req.body.type,
        auctionName: req.body.auctionName,
        containers: +req.body.containers,
        itemsInContainer: +req.body.itemsInContainer,
        height: req.body.height,
        weight: req.body.weight,
        blockPrice: +req.body.blockPrice,
        image: req.body.image
    });

    let lot = new Lot({
        auctionName: req.body.auctionName,
        currentPrice: 100,
        status:{
            registered:true,
            scheduledState:false,
            active:false,
            sold:false
        }
    })

    flower.save().then(createFlower =>{
        lot.flowerId = createFlower._id;
        lot.save().then(createLot => {
            console.log(createLot);
        })
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
        if(selected == 2){// If radio button option is "Yours" products
            productQuery
            .find({seller: req.userData.userId})
            .skip(pageSize * (currentPage-1))
            .limit(pageSize)
            
        }else{ // If radio button option is "All" products
            productQuery
            .skip(pageSize * (currentPage-1))
            .limit(pageSize)            
        }
    }

    productQuery
    .then(flowers =>{
        fetchedProducts = flowers;
        if(selected == 2){
            return Flower.find({seller: req.userData.userId}).countDocuments();
        }
        return Flower.countDocuments();
    }).then(count =>{
        res.status(200).json({
            message:"Products fetch successfully",
            products: fetchedProducts,
            maxProducts: count
        });
    });
});

router.delete('/:id', checkAuth, (req, res, next)=>{
    Lot.deleteOne({
        flowerId: req.params.id
    }).then(result =>{
        console.log("delete lot")
    })
    Flower.deleteOne({
        _id: req.params.id,
        seller: req.userData.userId
    }).then(relult =>{
        if(relult.n > 0){
            res.status(200).json({
                message: 'Delition successful!'
            })
        }else{
            res.status(401).json({
                message:'Not authorized!'
            })
        }
    })
})

router.get('/:id', (req, res, next)=>{
    Flower.findById(req.params.id).then(product =>{
        if(product){
            res.status(200).json({
                product: product
            })
        }
        else{
            res.status(404);
        }
    })
})

router.put("/:id", checkAuth, (req, res, next) => {
    console.log('tuk')
    const product = new Flower({
        _id: req.body.id,
        seller: req.userData.userId,
        name: req.body.name,
        type: req.body.type,
        containers: +req.body.containers,
        itemsInContainer: +req.body.itemsInContainer,
        height: +req.body.height,
        weight: +req.body.weight,
        blockPrice: +req.body.blockPrice,
        image: req.body.image
    });
    console.log(product);
    Flower.updateOne({
        _id: req.params.id,
        seller: req.userData.userId
    }, product).then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                message: "Update successful!"
            })
        } else {
            res.status(401).json({
                message: "Not authorized!"
            })
        }
    })
})

module.exports = router;