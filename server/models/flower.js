const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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
    count:{
        type: Number,
        require: true
    },
    price:{
        type: Number,
        require:true
    },
    min:{
        type:Number,
        default: 1
    },
    image:{
        type:String,
        require:true
    }
});

flowerSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Flower", flowerSchema);