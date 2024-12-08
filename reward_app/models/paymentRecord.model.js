const mongoose = require("mongoose");

const PaymentRecord = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
})