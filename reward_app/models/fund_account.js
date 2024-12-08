const mongoose =require("mongoose");
const contact_id =require("./razorpay_contact")

// const fundAccountSchema = mongoose.Schema({

  
//     contact: { 
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Contact',
//         required: true
//       },
//     fundAccound_id :{
//         type:String,
//         require :true
//     },
//     upiAddress:{
//         type : String ,
//         require : true
//     },
// },
// {timestamp : true}
// )

// // export fundAccountSchema;


const fundAccountSchema = new mongoose.Schema({
  contact: { 
    type: String,
    required: true
  },
  fundAccountId: {
    type: String,
    required: true
  },
  upiAddress: {
    type: String,
    required: true
  },
}, { timestamps: true });  // Fixed: should be timestamps: true

// Export the model
module.exports = mongoose.model('FundAccount', fundAccountSchema);
