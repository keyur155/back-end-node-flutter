const mongoose = require("mongoose");
const User = require('./user_model.js');

const userPurchaseSchema =new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    ecoCoins:{
        type:String,
        required:true
    },
    productName:{
        type:String,
        require:true
       },
    transaction_id:{
        type: String,
        require: true,
        unique: true
      },
    createdAt: {
        type: Date,
        default: Date.now,
      },
   
});

const UserPurchase = mongoose.model('UserPurchase', userPurchaseSchema);
module.exports = UserPurchase;

