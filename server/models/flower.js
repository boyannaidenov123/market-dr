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
    price:{
        type: Number,
        require:true
    },
    image:{
        type:String,
        require:true
    }
});

flowerSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Flower", flowerSchema);