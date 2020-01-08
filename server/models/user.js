const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    name:{
        type:String,
        require: true
    },
    password:{
        type:String,
        require:true
    },
    isTrader:{
        type:Boolean,
        require:true
    },
    history: [{
        date: { type: Date, require: true},
        lotId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lot",
            require: true
        },
        containers:{type:Number, require: true},
        flowerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flower",
            require: true
        },
        price:{type:Number, require: true}
    }]
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);