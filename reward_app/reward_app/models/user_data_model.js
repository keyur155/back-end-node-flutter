
const mongoose = require('mongoose');
const User = require('./user_model.js');
const userdataSchema = new mongoose.Schema({
    user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true
     },
    phoneNumber:{
        type: Number,
        require: true
     },
    echoCoins: {
       type: Number,
       required :true,
       default: 0
     },
    Recycled_items: {
         type: Number,
         required: true
       },
    Location: {
         type: String,
         required: true
       },
    Date: {
           type: Date,
           required: true
         },
    transaction_id: {
         type: String,
         required: true
       }
});

const User_Data = mongoose.model('User_Data', userdataSchema);

module.exports = User_Data;