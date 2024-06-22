const mongoose = require("mongoose");
const User = require('./user_model.js');

const OrderGeneratedSchema = new mongoose.Schema({

 user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true
     },
 product_id:{
    type: Number,
    require : true
 },
 order_id:{
    type:'String',
    require :true,
    unique: true
 },
 PhoneNumber:{
         type: Number,
         require: true
      },
 purchase_order_name :{
  type :String,
  require: true
  },
  product_price :{
  type : Number,
  require : true
  },
 address:{
   type: String,
   require: true
 },
 transaction_id:{
    type: String,
    require: true,
    unique: true
  },
 Date: { type: Date, required: true },
},
 { timestamps: true }
);

const OrderGenerated = mongoose.model('OrderGenerated', OrderGeneratedSchema);

module.exports = OrderGenerated;
