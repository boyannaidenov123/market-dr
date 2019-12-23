const mongoose = require('mongoose');

const lotShema = mongoose.Schema({
    flowerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Flower",
        require: true

    },
    auctionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Auction",
        require: true
    },
    endPrice:{
        type: Number,
        default: 10
    },
    currentPrice:{
        type:Number
    },
    status:{
        registered:{type:Boolean, require: true},
        scheduledState: {type:Boolean, require: true},
        active:{type:Boolean, require: true},
        sold:{type:Boolean, require: true},

    }
})

module.exports = mongoose.model("Lot", lotShema);