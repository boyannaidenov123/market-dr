const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const auctionSchema = mongoose.Schema({
    name:{
        type: String,
        require:true,
        unique:true
    },
    active:{
        type: Boolean,
        require: true
    },
    startDate:{
        type:Date,
        require:true
    },
    lotForSale:{
        type: Number,
        default: 0,
        require:true
    }

})

auctionSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Auction", auctionSchema);