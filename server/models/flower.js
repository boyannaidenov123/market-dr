const mongoose = require('mongoose');

const flowerSchema = mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    type:{
        type:String,
        require:true
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
    additionalInformation:{
        type: String
    }
});

module.exports = mongoose.model("Flower", flowerSchema);