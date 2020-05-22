const mongoose = require('mongoose');

const transactionData = mongoose.Schema({
    clientID:{
        type: String,
    },
    secret:{
        type: String,
    }
})

module.exports = mongoose.model("TransactionData", transactionData);