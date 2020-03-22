const mongoose = require('mongoose');

const lotShema = mongoose.Schema({
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    flowerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Flower",
        require: true
    },
    currentPrice:{
        type:Number,
        require:true
    },
    status:{
        registered:{type:Boolean, require: true},
        scheduledState: {type:Boolean, require: true},
        active:{type:Boolean, require: true},
        sold:{type:Boolean, require: true},
    },
    containers:{
        type: Number,
        require: true
    },
    auctionName: {
        type:String, 
        require: true
    }
})

module.exports = mongoose.model("Lot", lotShema);