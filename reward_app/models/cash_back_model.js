const mongoose = require('mongoose');

const cashbackSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    upi: { type: String, required: true },
    registeredPhone: { type: String, required: true },
    orderId:{type:String ,required:true},
  }, { timestamps: true });
  
  const Cashback = mongoose.model('Cashback', cashbackSchema);
  
  module.exports = Cashback;