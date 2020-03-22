const mongoose = require('mongoose');

const historyShema = mongoose.Schema({
    flowerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Flower",
        require:true
    },
    buyer:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    date:{
        type: Date,
        require:true
    },
    containers:{
        type: Number, 
        require: true
    },
    price:{
        type: Number,
        require: true
    },
    auctionName:{
        type: String,
        require: true
    }
})

module.exports = mongoose.model("History", historyShema);