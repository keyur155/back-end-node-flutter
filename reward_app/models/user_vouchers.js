
const mongoose = require("mongoose");
const User = require('./user_model.js');

const VoucherCreatedSchema = new mongoose.Schema({

 user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true
     },
 voucher_id:{
    type: Number,
    require : true
 },
 brand:{
    type: 'String',
    require : true

 },
 voucher_code:{
    type: 'String',
    require : true
 },
 category:{
    type:'String',
    required:true
 },
 order_id:{
    type:'String',
    require :true,
    unique: true
 },
  product_price :{
  type : Number,
  require : true
  },
  valid_from: {
    type: Date,
    required: true,
},
valid_until: {
    type: Date,
    required: true,
},
 transaction_id:{
    type: String,
    require: true,
    unique: true
  },
  is_active: {
    type: Boolean,
    default: true,
    
},
is_redeemed:{
    type: Boolean,
    default: false,    
},

 Date: { type: Date, required: true },
},
 { timestamps: true }
);

const VoucherCredited = mongoose.model('VoucherCredited', VoucherCreatedSchema);

module.exports = VoucherCredited;
