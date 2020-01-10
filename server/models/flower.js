const mongoose = require('mongoose');

const flowerSchema = mongoose.Schema({
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    name:{
        type: String,
        require: true
    },
    type:{
        type:String,
        require:true
    },
    containers:{
        type: Number,
        require: true
    },
    itemsInContainer:{
        type: Number,
        require: true
    },
    height:{
        type:Number,
        require: true
    },
    weight:{
        type:Number,
        require:true
    },
    blockPrice:{
        type: Number,
        require:true
    },
    imagePath:{
        type:String,
        require:true
    },
    auctionName:{
        type: String,
        require: true
    },
});

module.exports = mongoose.model("Flower", flowerSchema);