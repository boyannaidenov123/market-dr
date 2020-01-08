const mongoose = require('mongoose');

const lotShema = mongoose.Schema({
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
    auctionName: {
        type:String, 
        require: true
    }
})

module.exports = mongoose.model("Lot", lotShema);