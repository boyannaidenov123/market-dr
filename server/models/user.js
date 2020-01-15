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
    }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);