const mongoose = require('mongoose');

const orderCounterSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0
  },
  date: {
    type: String,
    required: true,
    unique: true
  }
});

const OrderCounter = mongoose.model('OrderCounter', orderCounterSchema);

module.exports = OrderCounter;
