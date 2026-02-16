const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  countryCode :{type:String},
  email: { type: String, unique: true, sparse: true },
  otp: { type: String },
  otpExpiry: { type: Date },
  echoCoins: {type: Number ,default: 0 }
  isGhost: { type: Boolean, default: true }
//  status : {type: Boolean, require: true}
//  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

