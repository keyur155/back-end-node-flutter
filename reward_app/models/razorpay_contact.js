
const mongoose = require('mongoose');
const User = require('./user_model.js');
const contactSchema = new mongoose.Schema({
    user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true
     },
     contact_id :{
       type:String,
       required:true
     },
     customer_name :{
        type:String,
        required:true
      },
    phoneNumber:{
        type: Number,
        require: true
     },
     reference_id:{
        type: Number,
        require: true
     }   
},
{
    timestamps: true 
});


const UsecontactSchema= mongoose.model('contactSchema', contactSchema);

module.exports = UsecontactSchema;