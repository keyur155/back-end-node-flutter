const mongoose = require('mongoose');
const User = require('./user_model.js');

const paymentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    phoneNumber : { type : String , required: true},
    timestamp: { type: Date, default: Date.now },
    upi :{type : String , required :true},
    paymentStatus: { type: String, default: 'pending', required: true }
  });
  
  const Payment = mongoose.model('Payment', paymentSchema);
  module.exports = Payment;
