const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  echoCoins: {type: Number ,default: 0 }
//  status : {type: Boolean, require: true}
//  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
