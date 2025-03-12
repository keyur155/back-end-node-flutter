require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const User = require('./reward_app/models/user_model.js');
const sendOtp = require('./reward_app/Services/otpService');
const verifyOTP = require('./reward_app/Services/verifyotp');
const User_Data =  require('./reward_app/models/user_data_model.js');
const AuthMiddleware =  require('./reward_app/middlewares/authMiddleware.js')
const OrderGenerated = require('./reward_app/models/user_order.js');
const mongoose = require('mongoose');
const ESG = require('./reward_app/models/esg_model.js');
const payment = require('./reward_app/models/payment_model.js');
const UserPurchase = require('./reward_app/models/purchase_history.js');
const Cashback = require('./reward_app/models/cash_back_model.js');
app.use(express.json());
const VoucherCredited =require('./reward_app/models/user_vouchers.js');
const OrderCounter = require('./reward_app/models/order_count.js');
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', true);
const upload = require("./reward_app/middlewares/multer.js");
const cloudinary = require("./reward_app/config/cloudinary.js");
const Product =  require('./reward_app/models/product_model.js');
const Category =require('./reward_app/models/category_model.js');
const axios = require('axios');
const Contact = require('./reward_app/models/razorpay_contact.js');
const FundAccount = require('./reward_app/models/fund_account.js');
const PaymentSuccess = require('./reward_app/models/payout.model.js');
const paymentFailure = require('./reward_app/models/paymentFailure.model.js');
// import { createClient } from 'redis';
const Redis = require('ioredis');
const {generateKey,startServer, redisClient} = require('./reward_app/Services/redisService');

// const redis = new Redis({
//   host: process.env.REDIS_HOST , // This will get the host from the environment variable
//   port: process.env.REDIS_PORT, // This will get the port from the environment variable
//   password: process.env.REDIS_PASSWORD // This will get the password from the environment variable
// });
// console.log('Connecting to Redis...');
// console.log('Host:', process.env.REDIS_HOST);
// console.log('Port:', process.env.REDIS_PORT);

// startServer().catch((error)=>{
//   console.log("error while connection to the the redis")
// })




// const cloudinary = require('cloudinary').v2; // Use .v2 to access the Cloudinary API
// const { Readable } = require('stream');
// const { Readable } = require('stream');

// cloudinary.config({
//   cloud_name: 'daeqtblkw', // Replace with your Cloudinary cloud name
//   api_key: '514668826354237',       // Replace with your Cloudinary API key
//   api_secret: 'SIRPzC_Lj8Eo-kpC74OfbndV1lU', // Replace with your Cloudinary API secret
// });
// console.log(cloudinary);

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

app.use(cors());

const corsOptions = {
  origin: ['http://localhost:8200', 'http://127.0.0.1:8200'],
  credentials: true,
};

app.use(cors(corsOptions));

// const client = redis.createClient();

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();


app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Content-Security-Policy-Report-Only', 'default-src: https:');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT POST PATCH DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

mongoose.connect(process.env.MONGODB_URI, { family: 4 }).then(
   ()=>{
       console.log("database connected");
   }
).catch((error) => { console.log(error);
});

// app.post('/login', async( req ,res ) =>{

// console.log("request received", req.body);
//     try {
//       // Find user by username
//       const { phoneNumber} = req.body ;
//       if (!req.body || !req.body.phoneNumber) {
//               throw new Error('Phone number is missing in request body');
//             }

//       const user = await User.findOne({phoneNumber});
//       if (!user) {
//         var response = await sendOtp(req.body.phoneNumber);
//         if(response.type == 'success'){
//              return res.status(200).json({ message : 'OTP sent successfully. Please verify your phone number' ,
//                       success :'true'
//                 });
//         }
//         else {
//             print("else part");
//             return res.status(200).json({ message : 'OTP sent successfully. Please verify your phone number' ,
//                 success :'true'
//             });

//         }

//       }

//       console.log({phoneNumber});

//      await sendOtp(req.body.phoneNumber);
//       return res.status(200).json({ message : 'OTP sent successfully. Please verify your phone number' ,
//       success :'true'
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message : 'Internal server error' });
//     }

// });

// app.post('/login', async(req, res) => {
  
//   try {
//     console.log("body ",req.body);
//     const{phoneNumber ,email} = req.body;
    
//     if(!req.body || !req.body.phoneNumber || !req.body.email){
//       throw new Error("Phone Number or Email Missing");
//     }

//      // Find users by email and phone number
//      const userByEmail = await User.findOne({ email });
//      const userByPhone = await User.findOne({ phoneNumber});
     
//      if (userByEmail && userByPhone) {
//       // Both users found, check if they are the same
//       if (userByEmail._id.toString() !== userByPhone._id.toString()) {
//           return res.status(401).json({ message: 'Invalid credentials: email and phone number do not match.' });
//       }
//   } else if (userByEmail && !userByPhone) {
//       // Email found but phone not found
//       return res.status(401).json({ message: 'Invalid credentials: phone number not found.' });
//   } else if (!userByEmail && userByPhone) {
//       // Phone found but email not found
//       return res.status(401).json({ message: 'Invalid credentials: email not found.' });
//   }

//       // If user does not exist, create a new user
//   let user;
//   var otp ;
//   let target, type ,cleanedPhoneNumber;
//   if (!userByEmail && !userByPhone) {
//         user = new User({ phoneNumber, email });
//         await user.save();
//         if (phoneNumber.startsWith('+91')) {
//           const cleanedPhoneNumber = phoneNumber.replace('+91', '');
//           target = cleanedPhoneNumber; // Send OTP to phone number
//           type = 'phone'; // Sending OTP to phone
//         } else {
//           target = email; // Send OTP to email
//           type = 'email'; // Sending OTP to email
//         }

//         otp = await sendOtp(target, type);
//         console.log("otp is", otp);
//     } else {
//       // If either userByEmail or userByPhone exists, use that user
      
//       if (phoneNumber.startsWith('+91')) {
//         const cleanedPhoneNumber = phoneNumber.replace('+91', '');
//         target = cleanedPhoneNumber; // Send OTP to phone number
//         type = 'phone'; // Sending OTP to phone
//       } else {
//         target = email; // Send OTP to email
//         type = 'email'; // Sending OTP to email
//       }
//       otp  = await sendOtp(target, type);
//       console.log("else otp is", otp);
//       }
      
      

//       // Save OTP and its expiry time to the user
//       user.otp = otp.otp;
//       user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
//       await user.save();
//       return res.status(200).json({ message : 'OTP sent successfully. Please verify your phone number' ,
//       success :'true'
//       });

//   } catch (error) {
//     console.log(error);
    
//     return res.status(500).json({ message : 'Internal server error' });
//   }
// })


app.post('/login', async (req, res) => {
  try {
    console.log("body ", req.body);
    const { phoneNumber, countryCode , email } = req.body;

    // Validate input
    if (!phoneNumber || !email) {
      return res.status(400).json({ message: "Phone Number or Email Missing" });
    }

    // Find users by email and phone number
    const userByEmail = await User.findOne({ email });
    const userByPhone = await User.findOne({ phoneNumber });

    // Check for user existence and validity
    if (userByEmail && userByPhone) {
      if (userByEmail._id.toString() !== userByPhone._id.toString()) {
        return res.status(401).json({ message: 'Invalid credentials: email and phone number do not match.' });
      }
    } else if (userByEmail) {
      
      return res.status(400).json({ message: 'Invalid credentials: phone number not found.' });
    } else if (userByPhone) {
      return res.status(400).json({ message: 'Invalid credentials: email not found.' });
    }

    // If user does not exist, create a new user
    let user = userByEmail || userByPhone || new User({ phoneNumber, countryCode ,email });
    if (!userByEmail && !userByPhone && !countryCode) {
      await user.save();
    }

    // Determine target and type for OTP
    let target, type;
    if (countryCode =="+91") {
      target = phoneNumber; // Cleaned phone number
      type = 'phone'; // Sending OTP to phone
    } else {
      target = email; // Send OTP to email
      type = 'email'; // Sending OTP to email
    }

    // Send OTP
    const otpResponse = await sendOtp(target, type);
    if (!otpResponse || !otpResponse.otp) {
      return res.status(500).json({ message: 'Failed to generate OTP.', type: 'error' });
    }

    // Save OTP and its expiry time to the user
    user.otp = otpResponse.otp; // Assuming otpResponse.otp is the correct OTP
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    await user.save();

    return res.status(200).json({ message: 'OTP sent successfully. Please verify your phone number.', success: 'true' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/resendOTP', async( req ,res ) =>{

console.log("request received", req.body);
    try {
      // Find user by username
      const { phoneNumber} = req.body ;
      if (!req.body || !req.body.phoneNumber) {
              throw new Error('Phone number is missing in request body');
            }

      const user = await User.findOne({phoneNumber});
      if (!user) {
        return res.status(400).json({msg :"user not found"} );
      }
      console.log({phoneNumber});

     await sendOtp(req.body.phoneNumber);
      return res.status(200).json({ message : 'OTP sent successfully.' ,
      success :'true'
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message : 'Internal server error' });
    }

});

// app.post('/verifyOTP', async (req, res) => {
//   console.log("Request received", req.body);

//   try {
//     const { phoneNumber, otp } = req.body;

//     // Validate request body
//     if (!phoneNumber || !otp) {
//       console.error("Phone number or OTP is missing in request body");
//       return res.status(400).json({ message: 'Phone number or OTP is missing in request body', type: 'error' });
//     }

//     console.log("Phone number from request body:", phoneNumber);

//     // Verify OTP
//     const result = await verifyOTP(phoneNumber, otp);
//     console.log("Result of OTP verification:", result);

//     if (result.type === 'error') {
//       console.error("Invalid OTP");
//       return res.status(400).json({ message: result.message, type: 'error' });
//     }

//     // Ensure phoneNumber is not null or undefined
//     if (!phoneNumber) {
//       console.error("Phone number is null or undefined after OTP verification");
//       return res.status(400).json({ message: 'Phone number cannot be null or undefined', type: 'error' });
//     }

//     // Find or create user
//     let user = await User.findOne({ phoneNumber }).select('phoneNumber echoCoins');
//     console.log("User found:", user);

//     if (!user) {
//       console.log("Attempting to create a new user with phone number:", phoneNumber);

//       // Final check to ensure phoneNumber is valid before creating a new user
//       if (!phoneNumber) {
//         console.error("Phone number is invalid right before creating new user");
//         return res.status(400).json({ message: 'Phone number is invalid', type: 'error' });
//       }

//       const newUser = new User({ phoneNumber, echoCoins: 0 });
//       user = await newUser.save();
//       console.log("New user created:", user);
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, phoneNumber: user.phoneNumber },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     console.log("Token generated for user:", token);

//     return res.status(200).json({
//       message: 'OTP verified successfully.',
//       success: 'true',
//       userId: user._id,
//       phoneNumber: user.phoneNumber,
//       echoCoins: user.echoCoins || 0,
//       token
//     });
//   } catch (error) {
//     console.error("Error during OTP verification and user handling:", error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });


// app.post('/verifyOTP', async( req ,res ) =>{

// console.log("request received", req.body);
//     try {
//       // Find user by username
//       const { phoneNumber , otp} = req.body ;
//       if (!req.body || !req.body.phoneNumber || !req.body.otp ) {
//               throw new Error('Phone number is missing in request body');
//             }

//       console.log({phoneNumber});
//       const result =await verifyOTP(req.body.phoneNumber,req.body.otp);
//       console.log("result is ",result);
//        if(result.type == 'error'){
//          return res.status(400).json({ message : 'Invalid OTP.' ,type :'error'
//        })}
//        else {
//         const user = await User.findOne({phoneNumber}).select('phoneNumber echoCoins');
// //        user = await User.findOne({ phoneNumber }).select('echoCoins');
//         if(!user){
//         const newUser = new User({phoneNumber: req.body.phoneNumber ,echoCoins: 0 });
//             user = await newUser.save();
//         }
//         console.log("user is",user);
// //        generating json token
//         const token = jwt.sign(
//                 { userId: user._id, phoneNumber: user.phoneNumber },
//                 process.env.JWT_SECRET,
//                 { expiresIn: '1h' } // Set token expiration time as needed
//               );
//        return res.status(200).json({ message : 'OTP verified successfully.' ,
//              success :'true',
//              userId: user._id,
//              phoneNumber: user.phoneNumber,
//              echoCoins: user.echoCoins || 0,
//              token
//              });
//        }
// //     await sendOtp(req.body.phoneNumber);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message : 'Internal server error' });
//     }

// });

app.post('/verifyOTP', async (req, res) => {
  console.log("request received", req.body);
  try {
      const { phoneNumber,countryCode, email, otp } = req.body;
      
      if (!phoneNumber && !email) {
          return res.status(400).json({ message: 'Phone number or email is required' });
      }

      if (!otp) {
          return res.status(400).json({ message: 'OTP is required' });
      }

      let user;
      if (email) {
          user = await User.findOne({ email });
      } else {
          user = await User.findOne({ phoneNumber });
      }

      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      if (user.otp !== otp) {
          return res.status(400).json({ message: 'Invalid OTP' });
      }

      if (new Date() > user.otpExpiry) {
          return res.status(400).json({ message: 'OTP has expired' });
      }
      console.log("user saved otp",user.otp);
      // OTP is valid
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      // Generating JSON token
      const token = jwt.sign(
          { userId: user._id, phoneNumber: user.phoneNumber },
          process.env.JWT_SECRET,
          { expiresIn: '24h' } // Set token expiration time as needed
      );

      return res.status(200).json({
          message: 'OTP verified successfully.',
          success: 'true',
          userId: user._id,
          phoneNumber: user.phoneNumber,
          email:user.email,
          echoCoins: user.echoCoins || 0,
          countryCode: user.countryCode || "+91",
          token
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/QRdata', AuthMiddleware, async (req, res) => {
  console.log("request received QRdata userid", req.query.userid);
  console.log("request received QRdata", req);
  try {
      // Check if the transaction_id is already registered
      const existingData = await User_Data.findOne({ transaction_id: req.body.transaction_id });
      if (existingData) {
          return res.status(202).json({ message: 'Reward already claimed' });
      }

      const user = await User.findOne({ _id: req.query.userid });
      // Check if the user exists
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Verify if the phone number matches
      if (user.phoneNumber !== req.body.Phone_no) {
          return res.status(402).json({ message: 'Phone number mismatch' });
      }

      const userData = new User_Data({
          user: req.query.userid,
          phoneNumber: req.body.Phone_no,
          echoCoins: req.body.Coin_Earned,
          Recycled_items: req.body.Recycled_items,
          Location: req.body.Location,
          Date: req.body.Date,
          transaction_id: req.body.transaction_id
      });

      const savedData = await userData.save();
      console.log("Saved data:", savedData);

      console.log("Before addition:", user.echoCoins);
      user.echoCoins += parseInt(req.body.Coin_Earned, 10);
      console.log("After addition:", user.echoCoins);

      // Save the updated user data
      const updatedUser = await user.save();
      console.log("Updated user data:", updatedUser);

      // Calculate ESG data
      const recycledItems = parseInt(req.body.Recycled_items, 10);
      const recycledWeight = recycledItems * 0.02; // Example weight per item
      const reductionCO2 = recycledItems * 0.05; // Example CO2 reduction per item
      const reductionLandfill = recycledItems * 0.00002; // Example landfill reduction per item
      const reductionWater = recycledItems * 0.1; // Example water reduction per item
      const noOfItemsThat = recycledItems  * 0.00036; // Assuming each item is considered for this

      // Find existing ESG record or create a new one
      let esgData = await ESG.findOne({ user: req.query.userid });
      if (esgData) {
        
          // Update existing ESG data
          esgData.No_of_Recycled_items += recycledItems;
          esgData.Recycled_weight += recycledWeight;
          esgData.Reduction_CO2_emission += reductionCO2;
          esgData.Reduction_landfill += reductionLandfill;
          esgData.Reduction_water_consumption += reductionWater;
          esgData.No_of_items_that += noOfItemsThat;
      } else {
          // Create new ESG data if it doesn't exist
          esgData = new ESG({
              user: req.query.userid,
              No_of_Recycled_items: recycledItems,
              Recycled_weight: recycledWeight,
              Reduction_CO2_emission: reductionCO2,
              Reduction_landfill: reductionLandfill,
              Reduction_water_consumption: reductionWater,
              No_of_items_that: noOfItemsThat
          });
      }
      const savedEsgData = await esgData.save();
      console.log("Saved ESG data:", savedEsgData);

      return res.status(200).json({ message: 'Coins Credited', success: true });

  } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

// app.post('/QRdata', AuthMiddleware, async (req, res) => {
//   console.log("request received QRdata userid", req.query.userid);
//   console.log("request received QRdata", req);
//   try {
//       // Check if the transaction_id is already registered
//       const existingData = await User_Data.findOne({ transaction_id: req.body.transaction_id });
//       if (existingData) {
//           return res.status(202).json({ message: 'Reward already claimed' });
//       }

//       const user = await User.findOne({ _id: req.query.userid });
//       // Verify if the phone number matches
//       if (user.phoneNumber !== req.body.Phone_no) {
//           return res.status(402).json({ message: 'Phone number mismatch' });
//       }

//       const userData = new User_Data({
//           user: req.query.userid,
//           phoneNumber: req.body.Phone_no,
//           echoCoins: req.body.Coin_Earned,
//           Recycled_items: req.body.Recycled_items,
//           Location: req.body.Location,
//           Date: req.body.Date,
//           transaction_id: req.body.transaction_id
//       });

//       const savedData = await userData.save();
//       console.log("Saved data:", savedData);

//       console.log("Before addition:", user.echoCoins);
//       user.echoCoins += parseInt(req.body.Coin_Earned, 10);
//       console.log("After addition:", user.echoCoins);

//       // Save the updated user data with transactions
//       let esgData = await ESG.findOne({ user: req.query.userid });
//         if (esgData) {
//             // Update existing ESG data
//             esgData.No_of_Recycled_items += recycledItems;
//             esgData.Recycled_weight += recycledWeight;
//             esgData.Reduction_CO2_emission += reductionCO2;
//             esgData.Reduction_landfill += reductionLandfill;
//             esgData.Reduction_water_consumption += reductionWater;
//             esgData.No_of_items_that += noOfItemsThat;
//         } else {
//             // Create new ESG data if it doesn't exist
//             esgData = new ESG({
//                 user: req.query.userid,
//                 No_of_Recycled_items: recycledItems,
//                 Recycled_weight: recycledWeight,
//                 Reduction_CO2_emission: reductionCO2,
//                 Reduction_landfill: reductionLandfill,
//                 Reduction_water_consumption: reductionWater,
//                 No_of_items_that: noOfItemsThat
//             });
//         }
                      

//       return res.status(200).json({ message: 'Coins Credited', success: true });

//   } catch (error) {
//       console.log(error);
//       return res.status(500).json({ message: 'Internal server error' });
//   }
// });



// app.post('/QRdata',AuthMiddleware ,async(req ,res ) =>{
// console.log("request received QRdata userid" ,req.query.userid);
// console.log("request received QRdata" ,req);
// try{
//              // If user is not found, return an error
// //             if (!user) {
// //                 return res.status(404).json({ message: 'User not found' });
// //             }
//      const userData = new User_Data({
//             user: req.query.userid,
//             phoneNumber: req.body.Phone_no,
//             echoCoins: req.body.Coin_Earned,
//             Recycled_items: req.body.Recycled_items,
//             Location: req.body.Location,
//             Date: req.body.Date,
//             transaction_id: req.body.transaction_id
//         });
//              const savedData = await userData.save();
//              console.log("Saved data:", savedData);

//              const user = await User.findOne({ _id: req.query.userid });
// //             console.log("user current coins is",user.echoCoins);
// //             user.echoCoins += req.body.Coin_Earned;
//              console.log("Before addition:", user.echoCoins);
//              user.echoCoins += parseInt(req.body.Coin_Earned, 10);
//              console.log("After addition:", user.echoCoins);

//                      // Save the updated user data with transactions
//               const UpdatedCoins= await user.save();
//               console.log("Updated user data:", UpdatedCoins);
//              return res.status(200).json({ message : 'Coins Credited' ,success :'true' })

// }catch(error)
// {
//    console.log(error);
//    return res.status(500).json({ message : 'Internal server error' });
// }

// });



app.get('/coins' ,AuthMiddleware,async(req,res)=>{
console.log("request received for coins userid" ,req.query.userid);

try{
const key = generateKey(req);
const catchedesg = await redisClient.get(key);
console.log("catched esg data",catchedesg)
if(catchedesg){
  const cachedData = JSON.parse(catchedesg);
  console.log("in if block", cachedData);

  return res.status(200).json({ message : 'Coins ' ,success :'true', ecoCoins: cachedData})
}

const user = await User.findOne({ _id: req.query.userid });
console.log("user coins are", user.echoCoins);
await redisClient.set(key ,JSON.stringify(user.echoCoins))
return res.status(200).json({ message : 'Coins ' ,success :'true', ecoCoins: user.echoCoins })

}catch(error){
 console.log(error);
}

});

app.get('/esg' ,AuthMiddleware ,async(req,res)=>{
  console.log("request received for esg userid" ,req.query.userid);
  try{
    const key = generateKey(req);
const catchedesg = await redisClient.get(key);
console.log("catched esg data",catchedesg)
  if(catchedesg){
    const cachedData = JSON.parse(catchedesg);
    console.log("in if block", cachedData);

    return res.status(200).json({ message : 'ESG' ,success :'true', ESG: cachedData })
  }
    const ESG_DATA = await ESG.find({ user: req.query.userid });
    await redisClient.set(key ,JSON.stringify(ESG_DATA))
    console.log("user coins data",  ESG_DATA);
    return res.status(200).json({ message : 'ESG' ,success :'true', ESG: ESG_DATA })
  }catch(error){
    console.log(error);
  }

});

app.get('/coinshistory',AuthMiddleware ,async(req ,res)=>{
    console.log("request received for coinshistory userid" ,req.query.userid);
    try{
      const key = generateKey(req);
      const catchedesg = await redisClient.get(key);
      console.log("catched esg data",catchedesg)
        if(catchedesg){
          const cachedData = JSON.parse(catchedesg);
          console.log("in if block", cachedData);
          
          return res.status(200).json({message : 'Coins ' ,success :'true' ,user: cachedData ,type :'Credit' })
        }
        const userData = await User_Data.find({ user: req.query.userid });
        await redisClient.set(key ,JSON.stringify(userData))
        // console.log("user coins data", userData);
        return res.status(200).json({ message : 'Coins ' ,success :'true' ,user: userData ,type :'Credit' })
    }catch(error){
     console.log(error);
    }
});


app.post('/orderGenerated',AuthMiddleware, async (req, res) => {
  console.log("request received for Order", req.body);

  try {
    // Extract necessary fields from the request body
    const {
      product_id,
      PhoneNumber,
      purchase_order_name,
      product_price,
      address,
      imagePath,
      productName,
      quantity,
      size,
      selectedColor
    } = req.body;

    // Ensure all required fields are provided
    if (!product_id || !PhoneNumber || !product_price || !purchase_order_name || !address ||!imagePath || !productName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    console.log("image path is",imagePath);

    const userId = req.query.userid;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.echoCoins < product_price) {
      return res.status(400).json({ message: 'Insufficient echoCoins' });
    }

    // Use MongoDB's atomic update operators to update user balance
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, echoCoins: { $gte: product_price } },
      { $inc: { echoCoins: -product_price } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: 'Failed to update user balance' });
    }

    // Generate order ID
    const today = new Date();
    const dateString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    let orderCounter = await OrderCounter.findOne({ date: dateString });

    if (!orderCounter) {
      orderCounter = new OrderCounter({ date: dateString, count: 0 });
    }

    orderCounter.count += 1;
    await orderCounter.save();

    // Construct order ID
    const orderIdPrefix = `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
    const orderId = `${orderIdPrefix}${String(orderCounter.count).padStart(3, '0')}`;

    // Set voucher validity dates
    const valid_from = new Date();
    const valid_until = new Date();
    valid_until.setDate(valid_from.getDate() + 7);
    const order_id =  orderId;
    const transaction_id = new mongoose.Types.ObjectId().toString();
    const orderDate = new Date().toISOString();


    // const today = new Date();
    // const dateString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
    // let orderCounter = await OrderCounter.findOne({ date: dateString });

    // if (!orderCounter) {
    //   orderCounter = new OrderCounter({ date: dateString, count: 0 });
    // }



    // orderCounter.count += 1;
    // await orderCounter.save();

    // // const orderId = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}/${String(orderCounter.count).padStart(3, '0')}`;


    // const orderId = `${orderIdPrefix}${String(orderCounter.count).padStart(3, '0')}`;

    // // Generating IDs by default
    // const order_id =  orderId;
    // const transaction_id = new mongoose.Types.ObjectId().toString();
    // const orderDate = new Date().toISOString();

    // Create a new order
    const order = new OrderGenerated({
      user: userId,
      product_id,
      order_id,
      PhoneNumber,
      imagePath,
      purchase_order_name,
      address,
      transaction_id,
      product_price,
      productName,
      selectedColor,
      size,
      quantity,
      Date: orderDate,
    });

    // Save the order to the database
    const savedOrder = await order.save();

        

    const userPurchase = new UserPurchase({
      user: userId,
      ecoCoins: product_price.toString(),
      productName: productName,
      transaction_id: transaction_id,
      createdAt: new Date()
    });

    await userPurchase.save();
    console.log("Saved order:", savedOrder);
    console.log("updated coins is ",updatedUser.echoCoins);
    return res.status(201).json({ message: 'Order generated successfully', success: 'true', order: savedOrder ,coins:updatedUser.echoCoins });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


// app.post('/orderGenerated', AuthMiddleware, async (req, res) => {
//   console.log("request received for Order", req.body);

//   try {
//     // Extract necessary fields from the request body
//     const {
//       product_id,
//       PhoneNumber,
//       purchase_order_name,
//       product_price,
//       address,
//       imagePath,
//       productName
//     } = req.body;

//     // Ensure all required fields are provided
//     if (!product_id || !PhoneNumber || !product_price || !purchase_order_name || !address ||!imagePath || !productName) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }
//     console.log("image path is",imagePath);

//     const userId = req.query.userid;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (user.echoCoins < product_price) {
//       return res.status(400).json({ message: 'Insufficient echoCoins' });
//     }

//     // Use MongoDB's atomic update operators to update user balance
//     const updatedUser = await User.findOneAndUpdate(
//       { _id: userId, echoCoins: { $gte: product_price } },
//       { $inc: { echoCoins: -product_price } },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(400).json({ message: 'Failed to update user balance' });
//     }

//     const today = new Date();
//     const dateString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
//     let orderCounter = await OrderCounter.findOne({ date: dateString });

//     if (!orderCounter) {
//       orderCounter = new OrderCounter({ date: dateString, count: 0 });
//     }

//     orderCounter.count += 1;
//     await orderCounter.save();
//     // const orderId = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}/${String(orderCounter.count).padStart(3, '0')}`;


//     const orderId = `${orderIdPrefix}${String(orderCounter.count).padStart(3, '0')}`;

//     // Generating IDs by default
//     const order_id =  orderId;
//     const transaction_id = new mongoose.Types.ObjectId().toString();
//     const orderDate = new Date().toISOString();

//     // Create a new order
//     const order = new OrderGenerated({
//       user: userId,
//       product_id,
//       order_id,
//       PhoneNumber,
//       imagePath,
//       purchase_order_name,
//       address,
//       transaction_id,
//       product_price,
//       productName,
//       Date: orderDate,
//     });

//     // Save the order to the database
//     const savedOrder = await order.save();

//     const userPurchase = new UserPurchase({
//       user: userId,
//       ecoCoins: product_price.toString(),
//       productName: productName,
//       transaction_id: transaction_id,
//       createdAt: new Date()
//     });

//     await userPurchase.save();
//     console.log("Saved order:", savedOrder);
//     console.log("updated coins is ",updatedUser.echoCoins);
//     return res.status(201).json({ message: 'Order generated successfully', success: 'true', order: savedOrder ,coins:updatedUser.echoCoins });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });

// 
app.get('/order_record',AuthMiddleware,async (req, res)=> {
    console.log("request received for Order record", req.query.userid);
     try {
        // const userId = req.user._id;
        // console.log(userId);
        // const orders = await OrderGenerated.findById(userId);
        const key = generateKey(req);
      const catchedesg = await redisClient.get(key);
      console.log("catched order data",catchedesg)
        if(catchedesg){
          const cachedData = JSON.parse(catchedesg);
          console.log("in if block", cachedData);
          if (Array.isArray(cachedData) && cachedData.length === 0) {
            return res.status(404).json({ message: 'No order records found', success: 'true', cachedData });
        }
          return res.status(200).json({message: 'Order records retrieved successfully', success: 'true', cachedData})
        }
        const orders = await OrderGenerated.find({ user: req.query.userid });
        await redisClient.set(key ,JSON.stringify(orders))
        console.log("orders are ",orders);

        if (!orders || orders.length === 0) {
          return res.status(404).json({ message: 'No order records found for the user' });
        }

        return res.status(200).json({ message: 'Order records retrieved successfully', success: 'true', orders });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
      }

});


app.post('/payment', async(req,res)=>{
  console.log("request received for payment  userid" ,req.query.userid);

  const userId = req.query.userid;
  const amount = req.body['amount'];
  console.log("payment request",amount ,userId);
  const user = await User.findOne({ _id: req.query.userid });
  const phoneNumber = user.phoneNumber;
  const current_coins = user.echoCoins;

  if (current_coins < amount) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }

  const avilable_coins = current_coins - amount;


  if ( !amount) {
    return res.status(400).json({ error: 'UserId and amount are required' });
  }

  user.echoCoins = avilable_coins;
  
  await user.save();
  
  const Payment = new payment({ userId, amount ,phoneNumber });
    // Save the payment record to the database
  await Payment.save();

});

app.get('/get-payment',async(req,res)=>{
  console.log("payment request received");
  try {
    const key = generateKey(req);
      const catchedesg = await redisClient.get(key);
      console.log("catched payment data",catchedesg)
        if(catchedesg){
          const cachedData = JSON.parse(catchedesg);
          console.log("in if block", cachedData);
          
          return res.status(200).json(payments)
        }
    const payments = await payment.find(); // Fetch all payment requests
    await redisClient.set(key ,JSON.stringify(payments))
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/update_status/:orderId' , async (req, res) => {
  console.log("update_status request received", req.body);
  try {
      const orderId = req.params.orderId; // Use req.params.userId to get userId from route parameter
      const updatedPayment = await payment.updateOne(
        { orderId: orderId }, // Filter as an object
        { $set: { paymentStatus: "success" } }
    );
    if (updatedPayment.matchedCount === 0) {
        return res.status(404).json({ error: 'Document not found' });
    }
    console.log(updatedPayment);

      // const updatedPayment = await payment.updateOne(
      //     userId,
      //     { $set: { paymentStatus: "success" } },
      //     { new: true }
      // );
      // console.log(updatedPayment);
      // res.status(200).json(updatedPayment);
  } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/get-payment-status', async (req, res) => {
  console.log("Request received for payment status", req.query.orderId);
  const orderId = req.query.orderId;
  console.log(orderId);

  try {
    const key = generateKey(req);
      const catchedesg = await redisClient.get(key);
      console.log("catched order data",catchedesg)
        if(catchedesg){
          const cachedData = JSON.parse(catchedesg);
          console.log("in if block", cachedData);
          
          return res.status(200).json({ success: 'true', status: 'success' })
        }
    const paymentRecord = await payment.findOne({ orderId: orderId }).exec();
    console.log("User order status ", paymentRecord);

    if (paymentRecord) {
      const status = paymentRecord.paymentStatus;
      console.log("status is",status);
      if(status == 'pending'){
        return res.status(200).json({ success: 'true', status: 'success' });
      }
      return res.status(200).json({ success: 'true', status: status });
    } else {
      return res.status(202).json({ success: 'false', status : "pending",message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: 'false', message: 'Internal server error' });
  }
});


// app.get('/get-payment-status' ,async(req ,res)=>{
//   console.log("request received for payment status",req.query.orderId)
//   const orderId = req.query.orderId;
//   // Correctly scoped and declared
//     console.log(orderId);
//     const status = await payment.find({ orderId: orderId }).exec();
//     console.log("status is  ",status);
//     return res.status(200).json({ success :'true' , status :status});

// });

//  payment request that store on database

app.post('/submit_cashback',AuthMiddleware, async (req, res) => {
  console.log("request received",req.body);
  try {
    const {amount, upi, registeredPhone ,orderId } = req.body;
    console.log("request received for payment upgrade userid" ,req.query.userid);
    
    const userId = req.query.userid;
    
    // Create a new cashback document
    const cashback = new Cashback({
      userId: userId,
      amount :amount,
      upi :upi,
      registeredPhone :registeredPhone,
      orderId :orderId
    });
    await cashback.save();

    const Payment = new payment({ userId, amount: amount, phoneNumber: registeredPhone ,orderId:orderId ,upi :upi });
    console.log("saving payment model",Payment);
    await Payment.save();

    // Save the document to MongoDB
    // Sending a successful response
    res.status(200).json({ message: 'Cashback submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//  razor apis
app.post('/transfer-cashback', async (req, res) => {
  const { userId,phoneNumber, transferAmount, accountDetails } = req.body; // accountDetails contains UPI ID or bank details

  try {
    // Fetch user's current cashback balance

    const user = await User.findOne({ userId: userId });

    const transferResponse = await axios.post(
      'https://api.razorpay.com/v1/payouts',
      {
        account_number: 'your_virtual_account_number', // Provided by Razorpay
        fund_account: {
          account_type: 'vpa',
          vpa: {
            address: accountDetails.upiId, // Or use bank details
          },
        },
        amount: transferAmount * 100, // Amount in paise
        currency: 'INR',
        mode: 'IMPS',
        purpose: 'payout',
        queue_if_low_balance: true,
        reference_id: `txn_${Date.now()}`,
        narration: 'Cashback Transfer',
      },
      {
        auth: {
          username: rzp_test_Hm2bEgLSzmFHRB,
          password: QDyRlG7DBgSyuvjHtbRFpKri,
        },
      }
    );

    if (transferResponse.data.status === 'processing') {
     
      res.json({ success: true, message: 'Cashback transferred successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Transfer failed' });
    }
  } 
    catch (error) {
    res.status(500).send('Error transferring cashback');
  }
});

// voucher checout procedure
app.post('/checkoutVoucher', AuthMiddleware, async (req, res) => {
  console.log("request received and user id is", req.query.userid);
  const userId = req.query.userid;
  const {
    product_price,
    voucher_id,
    category,
    brand,
    offer,
    voucher_code,
    imagePath
  } = req.body;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const current_coins = user.echoCoins;

    if (current_coins < product_price) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    const available_coins = current_coins - product_price;

    // Update user's echoCoins 
    user.echoCoins = available_coins;
    await user.save();

    // Generate order ID
    const today = new Date();
    const dateString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    let orderCounter = await OrderCounter.findOne({ date: dateString });

    if (!orderCounter) {
      orderCounter = new OrderCounter({ date: dateString, count: 0 });
    }

    orderCounter.count += 1;
    await orderCounter.save();

    // Construct order ID
    const orderIdPrefix = `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`;
    const orderId = `${orderIdPrefix}${String(orderCounter.count).padStart(3, '0')}`;

    // Set voucher validity dates
    const valid_from = new Date();
    const valid_until = new Date();
    valid_until.setDate(valid_from.getDate() + 7);

    // Create a new VoucherCredited entry
    const voucher = new VoucherCredited({
      user: userId,
      voucher_id,
      brand,
      voucher_code,
      category,
      order_id: orderId,
      product_price,
      valid_from,
      valid_until,
      offer,
      transaction_id: new mongoose.Types.ObjectId().toString(),
      is_active: true,
      is_redeemed: false,
      imagePath,
      Date: new Date()
    });

    await voucher.save();

    // Record user purchase
    const userPurchase = new UserPurchase({
      user: userId,
      ecoCoins: product_price.toString(),
      productName: brand,
      transaction_id: voucher.transaction_id,
      createdAt: new Date()
    });

    await userPurchase.save();

    res.status(200).json({ success: true, message: 'Payment deducted and voucher added successfully', orderId :orderId });

  } catch (error) {
    console.error('Error processing voucher:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// app.post('/checkoutVoucher' ,AuthMiddleware, async(req,res)=>{

//   console.log("request received and user id is",req.query.userid);
//   const userId = req.query.userid;
//   const {
//     product_price,
//     voucher_id,
//     category,
//     brand,
//     offer,
//     voucher_code,
// } = req.body;
  
//   try{
//     const user = await User.findOne({ _id: req.query.userid });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//   }

//   const current_coins = user.echoCoins;

//   if (current_coins < product_price) {
//       return res.status(400).json({ error: 'Insufficient funds' });
//   }

//   const available_coins = current_coins - product_price;

//   user.echoCoins = available_coins;
//   await user.save();
  

//     const valid_from = new Date();
//     const valid_until = new Date();
//     valid_until.setDate(valid_from.getDate() + 7);
//     const today = new Date();
//     const dateString = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

//     let orderCounter = await OrderCounter.findOne({ date: dateString });

//     if (!orderCounter) {
//       orderCounter = new OrderCounter({ date: dateString, count: 0 });
//     }

//     orderCounter.count += 1;
//     await orderCounter.save();
//     // const orderId = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}/${String(orderCounter.count).padStart(3, '0')}`;
//     const orderId = `${orderIdPrefix}${String(orderCounter.count).padStart(3, '0')}`;

//     // Generating IDs by default
//     const order_id =  orderId;
//     // const transaction_id = new mongoose.Types.ObjectId().toString();
//     const orderDate = new Date().toISOString(); // Set expiry date to 7 days from now

//     // const order_id = new mongoose.Types.ObjectId().toString(); // Generate a unique order ID
//     const transaction_id = new mongoose.Types.ObjectId().toString(); // Generate a unique transaction ID

//     // Create a new VoucherCredited entry
//     const voucher = new VoucherCredited({
//         user: userId,
//         voucher_id,
//         brand,
//         voucher_code,
//         category,
//         order_id,
//         product_price,
//         valid_from,
//         valid_until,
//         transaction_id,
//         is_active: true,
//         is_redeemed: false,
//         Date: new Date()
//     });

//     await voucher.save();

    
//     const userPurchase = new UserPurchase({
//       user: userId,
//       ecoCoins: product_price.toString(),
//       productName: brand,
//       transaction_id: transaction_id,
//       createdAt: new Date()
//     });
//     await userPurchase.save();

//     res.status(200).json({ success: true, message: 'Payment deducted and voucher added successfully' });

//   }catch(error){
//     console.error('Error processing voucher:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }


// });


// 

//  User voucher details data

// 
app.get('/getVouchers', AuthMiddleware, async (req, res) => {
  console.log("request received for vouchers");
  try {
    const key = generateKey(req);
    const catched = await redisClient.get(key);
    console.log("catched vouchers data",catched)
        if(catched){
          const cachedData = JSON.parse(catched);
          console.log("in if block", cachedData);
          
          return res.status(200).json(cachedData)
        }
    
    const userId = req.query.userid; // Correctly scoped and declared
    console.log(userId);
    const vouchers = await VoucherCredited.find({ user: userId }).exec();
    await redisClient.set(key ,JSON.stringify(vouchers))
    // console.log(vouchers);
    res.status(200).json(vouchers);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//  Purchse history that display  on  debit coins
app.get('/purchaseHistory',AuthMiddleware ,async(req,res)=>{
  console.log("request received for purchase history");
  try {
    const key = generateKey(req);
    const catched = await redisClient.get(key);
    console.log("catched purchase data",catched)
        if(catched){
          const cachedData = JSON.parse(catched);
          console.log("in if block", cachedData);
          
          return res.status(200).json({ message : 'Coins ' ,success :'true' , userPurchase: cachedData ,type :'Debit' })
        }
    const userId = req.query.userid; // Correctly scoped and declared
    console.log(userId);
    const userPurchase = await UserPurchase.find({ user: userId }).exec();
    console.log("User purchase ",userPurchase);
    await redisClient.set(key,JSON.stringify(userPurchase));
    return res.status(200).json({ message : 'Coins ' ,success :'true' , userPurchase: userPurchase ,type :'Debit' })
    // res.status(200).json({type:'Debit',userPurchase:userPurchase});
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
} );

app.get('/payment-history', AuthMiddleware ,async (req, res) => {
  console.log("request received for payment-history",req.query.userid);
  const userId = req.query.userid; // Correctly scoped and declared
  console.log(userId);
  try {
    const key = generateKey(req);
    const catched = await redisClient.get(key);
    console.log("catched paymet-hostory data",catched)
        if(catched){
          const cachedData = JSON.parse(catched);
          console.log("in if block", cachedData);
          
          return res.status(200).json({ success: true,payments: cachedData })
        }
      const payments = await PaymentSuccess.find({ user: userId  }).sort({ timestamp: -1 });
       // Fetch payments for the user, sorted by time
       await redisClient.set(key,JSON.stringify(payment));
       console.log("payment log",payments);
      res.json({ success: true,payments: payments });
  } catch (error) {
  console.log("error is ",error);
      res.status(500).json({ success: false, error: error.message });
  }
});


app.post('/redeem', async (req, res) => {
  const { userId, coins, upiId } = req.body;

  try {
    // 1. Verify user and coin balance
    const user = await getUserById(userId);
    if (!user || user.coins < coins) {
      return res.status(400).json({ error: 'Invalid user or insufficient coins' });
    }

    // 2. Calculate payout amount
    const payoutAmount = convertCoinsToMoney(coins);

    // 3. Create fund account for UPI
    const fundAccount = await razorpay.fundAccounts.create({
      contact_id: user.razorpayContactId,
      account_type: 'vpa',
      vpa: {
        address: upiId
      }
    });

    // 4. Create payout
    const payout = await razorpay.payouts.create({
      account_number: 'YOUR_RAZORPAY_ACCOUNT_NUMBER',
      fund_account_id: fundAccount.id,
      amount: payoutAmount * 100, // Amount in paise
      currency: 'INR',
      mode: 'UPI',
      purpose: 'payout',
      queue_if_low_balance: true,
      reference_id: `PAYOUT_${userId}_${Date.now()}`,
    });

    // 5. Update user's coin balance
    await updateUserCoinBalance(userId, -coins);

    // 6. Send response
    res.json({ success: true, payout: payout });

  } catch (error) {
    console.error('Error processing redemption:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/get-order-admin' ,async(req, res)=>{
  console.log("get order request received");
  try {
    const key = generateKey(req);
    const catched = await redisClient.get(key);
    console.log("catched order admin data",catched)
        if(catched){
          const cachedData = JSON.parse(catched);
          console.log("in if block", cachedData);
          
          return res.status(200).json(cachedData)
        }
    
    const orders = await OrderGenerated.find(); // Fetch all payment requests
    await redisClient.set(key,JSON.stringify(orders));
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }


});

app.post('/admin/upload', upload, async (req, res) => {
  console.log("request received for upload image");
  try {
      if (!req.file) {
          return res.status(400).send("No file uploaded");
      }

      // If using memory storage, upload directly from buffer
      if (req.file.buffer) {
          // Upload to Cloudinary from buffer
          cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
              if (err) {
                  console.log(err);
                  return res.status(500).json({
                      success: false,
                      message: "Error uploading to Cloudinary"
                  });
              }

              const imageUrl = result.secure_url;
              console.log("Image URL is", imageUrl);
              res.status(200).json({
                  success: true,
                  message: "Success",
                  imageUrl: imageUrl
              });
          }).end(req.file.buffer); // Send the buffer to Cloudinary
      } else {
          // If using disk storage, upload from file path
          cloudinary.uploader.upload(req.file.path, (err, result) => {
              if (err) {
                  console.log(err);
                  return res.status(500).json({
                      success: false,
                      message: "Error uploading to Cloudinary"
                  });
              }

              const imageUrl = result.secure_url;
              console.log("Image URL is", imageUrl);
              res.status(200).json({
                  success: true,
                  message: "Success",
                  imageUrl: imageUrl
              });
          });
      }
  } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Upload failed' });
  }
});


// app.post('/admin/upload', upload.single('image'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("No file uploaded");
//     }
//     cloudinary.uploader.upload(req.file.path,function(err,result){
//               if(err){
//                 console.log(err);
//                 return res.status(500).json({
//                 success :false,
//                 message:"Error"
//               });
//               }
//               // console.log("response ",res)
//               const imageUrl = result.secure_url;
//               console.log("Image url is",imageUrl);
//               res.status(200).json({
//                 success:true,
//                 message:"Success",
//                 imageUrl :imageUrl
//               });
//     })
   
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     res.status(500).json({ error: 'Upload failed' });
//   }
// });

app.post('/admin/category',async(req,res) => {
  console.log("request received for category",req.body);
try{
  const category = req.body;
  const newcategory = new Category(category);
  await newcategory.save();
  res.status(200).json({ success: true, message: 'Category uploaded successfully'});
}
catch(error){
  console.log(error);
  if (error.code === 11000) { // Duplicate key error
    res.status(400).json({ message: 'Category already exists' });
  } else {
    res.status(500).json({ message: 'Server error', error });
  }
}
});

app.get('/admin/get-categories', async(req,res) =>{
  try {
    const key = generateKey(req);
    const catched = await redisClient.get(key);
    console.log("catched order admin data",catched)
        if(catched){
          const cachedData = JSON.parse(catched);
          console.log("in if block", cachedData);
          
          return res.status(200).json(cachedData)
        }
    const categories = await Category.find().select('name'); // Adjust fields as needed
    await redisClient.set(key,JSON.stringify(categories));
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

app.put('/admin/update-category', async (req, res) => {
  try {
    
    const {oldName, newName } = req.body; // Assuming you're sending the new name in the request body
    if (!oldName || !newName) {
      return res.status(400).json({ message: 'Both oldName and newName are required' });
    }
    const updatedCategory = await Category.findOneAndUpdate(
      { name: oldName }, // Find the category with the old name
      { name: newName }, // Update to the new name
      { new: true } // Return the updated document
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
});

app.delete('/admin/delete-category', async (req, res) => {
  try {
    const { name } = req.body; ;
    const result = await Category.findOneAndDelete(name);
    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
});


app.get('/admin/get-product-info', async(req,res) =>{
  console.log("request received product info");
  try {
    const key = generateKey(req);
    const catched = await redisClient.get(key);
    console.log("catched product-info data",catched)
        if(catched){
          const cachedData = JSON.parse(catched);
          console.log("in if block", cachedData);
          
          return res.status(200).json(cachedData)
        }
    const products = await Product.find(); // Adjust fields as needed
    await redisClient.set(key,JSON.stringify(products));
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

app.post('/admin/edit-product' ,async(req,res) => {
  const {
    productId, 
    name, 
    description, 
    price, 
    category, 
    size, 
    color, 
    stock, 
    imageUrl
  } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId, 
      {
        name,
        description,
        price,
        category,
        size,
        color,
        stock,
        imageUrl,
      }, 
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error });
  }
  
});


app.post('/admin/delete-product', async (req, res) => {
   const { productId } = req.body;
  // const productId = req.params.productId;
   console.log("request received for deleting ",productId);
  try {
    const deletedProduct = await Product.findOneAndDelete({ productId: productId });

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


app.post('/admin/products', async (req, res) => {
  try {
    
    const productData = req.body;
    console.log("received product data",productData);
    // Create a new product in the database
    const newProduct = new Product(productData);
    await newProduct.save().then(product => {
      console.log('Product created:', product);
    })
    .catch(error => {
      console.error('Error creating product:', error);
    });

    res.status(200).json({ success: true, message: 'Product uploaded successfully', product: newProduct });
  } catch (error) {
    console.error('Error uploading product:', error);
    res.status(500).json({ success: false, message: 'Failed to upload product' });
  }
});

app.get('/admin/app-counter', async (req,res)=> {
console.log("request received for app counter");
try {

  // const key = generateKey(req);
  //   const catched = await redisClient.get(key);
  //   console.log("catched purchase data",catched)
  //       if(catched){
  //         const cachedData = JSON.parse(catched);
  //         console.log("in if block", cachedData);
          
  //         return res.status(200).json()
  //       }
  // Count the number of payments with 'pending' status
  const pendingCount = await payment.countDocuments({ paymentStatus: 'pending' });
  
  // Count the number of payments with 'success' status
  const successCount = await payment.countDocuments({ paymentStatus: 'success' });

  const totalOrderReceived = pendingCount +  successCount;
  const result = await UserPurchase.aggregate([
    {
        $group: {
            _id: null, // Grouping by null to get a single result
            ecoCoins: { $sum: { $toDouble: "$ecoCoins" } } // Convert to double if it's a string
        }
    }
]);
// Extract the total from the result
const totalEcoCoinsPrice = result.length > 0 ? result[0].ecoCoins: 0;

const successAmountResult = await payment.aggregate([
  {
      $match: { paymentStatus: 'success' } // Filter for successful payments
  },
  {
      $group: {
          _id: null, // Grouping by null to get a single result
          totalSuccessAmount: { $sum: { $toDouble: "$amount" } } // Convert to double if it's a string
      }
  }
]);
const totalSuccessAmount = successAmountResult.length > 0 ? successAmountResult[0].totalSuccessAmount : 0;
  // Send the counts in the response
  res.json({
      pendingCount,
      successCount,
      totalEcoCoinsPrice,
      totalOrderReceived,
      totalSuccessAmount
  });
} catch (error) {
  console.error("Error fetching payment counts:", error);
  res.status(500).json({ error: 'Internal server error' });
}

});

// ******machine data  related apis
app.get('/admin/get-machine-data', async(req,res)=>{
  console.log("request recived for get-machine-data");
  const { page = 1, limit = 10 } = req.query;
  try {
    const phpApiUrl = 'https://www.reatmos.com';
    // Make a GET request to the PHP API
    // const response = await axios.get(`${phpApiUrl}/adminApis/FetchMachineData.php`); // Adjust the endpoint as needed

    const response = await axios.get(`${phpApiUrl}/adminApis/FetchMachineData.php`, {
      params: {
          page,
          limit
      }
  });
    // console.log("received data are", response)
    // Send the data received from the PHP API back to the client
    res.json(response.data);
} catch (error) {
    console.error('Error fetching data from PHP API:', error);
    res.status(500).json({ message: 'Error fetching data' });
}

})

// app.get('/admin/get-filtered-data', async(req,res)=>{
//   console.log("request recived for get-FILTERD-data");
//   const { startDate , endDate,mcid,city,page,limit } = req.query;
//   try {
//     const phpApiUrl = 'https://www.reatmos.com';
  
//     const response = await axios.get(`${phpApiUrl}/adminApis/getFilteredData.php`, {
//       params: {
//         startDate, 
//         endDate,
//         mcid,
//         city,
//         page,
//         limit
//       }
//   });
//     console.log("received data FOR filtered", response.data)
//     // Send the data received from the PHP API back to the client
//     res.json(response.data);
// } catch (error) {
//     console.error('Error fetching data from PHP API:', error);
//     res.status(500).json({ message: 'Error fetching data' });
// }

// });

app.get('/admin/get-machine-images', async(req, res)=>{
  const { mcid,date,phoneNumber } = req.query;
   console.log("request received for images", req.query);
  try{
    const phpApiUrl = 'https://www.reatmos.com';
      const response = await axios.get(`${phpApiUrl}/adminApis/getMCIDiMAGES.php`, {
          params: {
            mcid,
            date,
            phoneNumber
          }
      }).then(response => {
        // Check if the response is defined and has a status
        if (response && response.status) {
          if (response.status === 200) {
            // Handle successful response
            // console.log('Images:', response.data);
            return res.status(200).json(response.data );
          } else if (response.status === 201) {
            // Handle case where resource was created (if applicable)
            console.log('Resource created, but no images returned.');
            return res.status(201).json("Unexpected response status:",response.status)
          } else {
            // Handle unexpected status codes
            console.error('Unexpected response status:', response.status);
          }
        } else {
          console.error('Response is undefined or does not have a status.');
        }
      }).catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
        } else {
          // The request was made but no response was received
          console.error('Error message:', error.message);
        }
      });
      // console.log("Received data from PHP API:", response.data);
      // res.json(response.data);

  }
  catch (error){
    console.log("error", error);
    res.status(500).json({ message: 'Error fetching data' });
  }

});

app.get('/admin/get-filtered-data', async (req, res) => {
  console.log("Request received for get-FILTERD-data");
  const { startDate, endDate, mcid, city, page, limit } = req.query;
  console.log("Received request parameters:", { startDate, endDate, mcid, city, page, limit });

  try {
      const phpApiUrl = 'https://www.reatmos.com';
      const response = await axios.get(`${phpApiUrl}/adminApis/getFilteredData.php`, {
          params: {
              startDate,
              endDate,
              mcid,
              city,
              page,
              limit
          }
      });

      console.log("Received data from PHP API:", response.data);
      res.json(response.data);
  } catch (error) {
      console.error('Error fetching data from PHP API:', error);
      res.status(500).json({ message: 'Error fetching data' });
  }
});


app.get('/admin/get-total-counter' , async(req ,res) =>{
 try {
   console.log("request received for total counter");
    const phpApiUrl = 'https://www.reatmos.com';
    // Make a GET request to the PHP API
    // const response = await axios.get(`${phpApiUrl}/adminApis/FetchMachineData.php`); // Adjust the endpoint as needed

    const response = await axios.get(`${phpApiUrl}/adminApis/totalcounter.php`);
    // console.log("received data are", response)
    // Send the data received from the PHP API back to the client
    res.json(response.data);
} catch (error) {
    console.error('Error fetching data from PHP API:', error);
    res.status(500).json({ message: 'Error fetching data' });
}

})


app.post('/admin/login' ,async(req,res) => {
  try {
    console.log("request received ",req.body);
    const {  password ,username} = req.body;
    
    // Example of making an API request with axios
    const response = await axios.post('https://www.reatmos.com/adminApis/adminAuth.php', { password ,username});
    console.log("response data after url",response.data);
    // console.log("response data after url1",response.data);
    if (response.status === 200 && response.data.success == true) {
      // Handle successful login
      res.cookie('authToken', response.data.token, { httpOnly: true, secure: true, sameSite: 'strict' });
     
      console.log("response data if",response.data);
      res.status(200).json({ success : true , message: 'Login successfull', token: response.data.token ,role : response.data.role ,name :response.data.name , areaDetails :response.data.area_details});
    } 
    else if(response.status === 200 && response.data.success == false){
      console.log("response data else if",response.data);
      res.status(400).json({success : false, message: 'Invalid username  or password' });
    } 
    else {
      console.log("en else part");
      // Handle unexpected status codes
      res.status(response.status).json({ message: 'Unexpected1 status code' });
    }
  } catch (error) {
    if (error.response) {
      
      res.status(error.response.status).json({ message: error.response.data });
    } else if (error.request) {
      // The request was made, but no response was received
      res.status(500).json({ message: 'No response received from the server' });
    } else {
      // Something happened in setting up the request that triggered an error
      res.status(500).json({ message: 'Error in setting up the request' });
    }

    console.error('Error during login request:', error);
  }
})

app.post('/admin/change-password' ,async(req,res) => {
  try {
    console.log("request received ",req.body);
    const { password ,username} = req.body;
    
    // Example of making an API request with axios
    const response = await axios.post('https://www.reatmos.com/adminApis/change-password.php', {password ,username});
    console.log("response data after url",response.data);
    // console.log("response data after url1",response.data);
    if (response.status === 200 && response.data.success == true) {
      // Handle successful login
      res.cookie('authToken', response.data.token, { httpOnly: true, secure: true, sameSite: 'strict' });
     
      console.log("response data if",response.data);
      res.status(200).json({ success : true , message: 'update  successfull'});
    } 
    else if(response.status === 200 && response.data.success == false){
      console.log("response data else if",response.data);
      res.status(400).json({success : false, message: 'Invalid  password' });
    } 
    else {
      console.log("en else part");
      // Handle unexpected status codes
      res.status(response.status).json({ message: 'Unexpected1 status code' });
    }
  } catch (error) {
    if (error.response) {
      
      res.status(error.response.status).json({ message: error.response.data });
    } else if (error.request) {
      // The request was made, but no response was received
      res.status(500).json({ message: 'No response received from the server' });
    } else {
      // Something happened in setting up the request that triggered an error
      res.status(500).json({ message: 'Error in setting up the request' });
    }

    console.error('Error during login request:', error);
  }
});


// **********************************Razor pay APIS**********************


app.post('/create-contact', async (req, res) => {

  const { username, email, phoneNumber, orderId } = req.body;
  console.log("request received for create contact",req.body);
  const userId ="6676c009608ec42288d203ea";
  // Validate phone number
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  let data = JSON.stringify({
    "name": username,
    "email": email || '',
    "contact": `91${phoneNumber}`, // Ensure phoneNumber is valid
    "type": "customer",
    "reference_id": orderId,
    "notes": {
      "random_key_1": "Make it so.",
      "random_key_2": "Tea. Earl Grey. Hot."
    }
  });

  // Construct the authorization header
  const apiKey = process.env.RAZORPAY_KEY_ID;
  const apiSecret = process.env.RAZORPAY_SECRET;
  console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
  console.log('Razorpay Secret:', process.env.RAZORPAY_SECRET);

  const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.razorpay.com/v1/contacts',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    data: data
  };

    try {
      // Check if the contact already exists for the user
      const existingContact = await Contact.findOne({ user: userId }).exec();
      
      if (!existingContact) {
        // Make the API request to create the contact
        const response = await axios.request(config);
        
        // Create a new contact in your database
        const newContact = new Contact({
          user: userId,
          contact_id: response.data.id,
          customer_name: response.data.name,
          phoneNumber: response.data.contact, // Use the correct field from response
          reference_id: response.data.reference_id
        });
  
        await newContact.save();
        
        return res.status(201).json({ message: 'Contact registered', data: response.data }); // Send success response
      }
      else {
        console.log("existing contact",existingContact)
        return res.status(409).json({ message: 'Contact already exists' ,data :existingContact }); // Conflict response
      }
    } catch (error) {
      console.error('Error creating contact:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Error creating contact', error: error.response ? error.response.data : error.message });
    }
   

});


app.post('/fund-account' ,async(req ,res) => {
  const {contact_id , address} = req.body;
  console.log("request received fund account",req.body);
  const apiKey = process.env.RAZORPAY_KEY_ID;
  const apiSecret = process.env.RAZORPAY_SECRET;
  console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
  console.log('Razorpay Secret:', process.env.RAZORPAY_SECRET);
  try {
  let fundAccount = await FundAccount.findOne({ contact: contact_id });
  if (fundAccount) {
    console.log(fundAccount.fundAccountId);
    return res.status(200).json({ message: 'Fund account already exists', fundAccountId: fundAccount.fundAccountId });
  }

  const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;

  let data = JSON.stringify({
    "contact_id": contact_id,
    "account_type": "vpa",
    "vpa": {
      "address": address
    }
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.razorpay.com/v1/fund_accounts',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': authHeader
    },
    data : data
  };
  const response = await axios.request(config);
    const fundAccountData = response.data;

    // Save fund account details to database
    fundAccount = new FundAccount({
      // user: req.user._id, // Assuming user ID is available in the request
      contact: contact_id,
      fundAccountId: fundAccountData.id,
      upiAddress: address
    });
    await fundAccount.save();

    return res.status(201).json({ message: 'Fund account created', fundAccountId: fundAccountData.id });
  
  // axios.request(config)
  // .then((response) => {
  //   console.log(JSON.stringify(response.data));
  //   return res.status(201).json({ message: 'fund_account created', data: response.data });
  // })
  // .catch((error) => {
  //   console.log(error);
  //   return res.status(500).json({ message: 'Internal server error', data: error });
  // });
}catch (error) {
  console.error(error);
  return res.status(500).json({ message: 'Internal server error' });
}

 
})

app.post('/payout',async(req,res) =>{

  const {fundAccount_id , amount,orderId} = req.body;
  console.log("request received for payment upgrade userid" ,req.query.userid);
    
    const userId = req.query.userid;
  console.log("request received payout",req.body);
  let data = JSON.stringify({
    "account_number": 2323230086959145,
    "fund_account_id": fundAccount_id,
    "amount": amount * 100,
    "currency": "INR",
    "mode": "UPI",
    "purpose": "refund",
    "queue_if_low_balance": true,
    "reference_id": "Acme Transaction ID 12345",
    "narration": "Acme Corp Fund Transfer",
    "notes": {
      "random_key_1": "Make it so.",
      "random_key_2": "Tea. Earl Grey. Hot."
    }
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.razorpay.com/v1/payouts',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Basic cnpwX3Rlc3RfWUx5U1hlTmNqZUJTS1Q6VjJaWTVEWDJDWDZqVnAyb2dvekh1T2hW'
    },
    data : data
  };
  
   const response =await axios.request(config);
   console.log("response",response.status);
   if (response.status == 200 ||response.data.status === 'processing') {
    const successData = {
      user:userId,
        payoutId: response.data.id,
        fundAccountId: response.data.fund_account_id,
        amount: response.data.amount,
        fees: response.data.fees,
        tax: response.data.tax,
        status: response.data.status,
        referenceId: response.data.reference_id,
        createdAt: new Date(response.data.created_at * 1000),
        orderId: orderId // Convert from UNIX timestamp
        // merchantId: response.data.merchant_id,
    };
    const paymentSuccessEntry = new PaymentSuccess(successData); // Assuming PaymentSuccess is a class
        await paymentSuccessEntry.save();
    // const paymentSuccess = new paymentSuccess(successData);
    // await paymentSuccess.save();
    return res.status(201).json({ message: 'Transcation Succesfull',
       payoutId:response.data.id,
       amount: response.data.amount,
       status: response.data.status,
       success:true,
       orderId:orderId,
       createdAt: successData.createdAt
       });
} else {
    const failureData = {
        payoutId: response.data.id,
        fundAccountId: response.data.fund_account_id,
        amount: response.data.amount,
        status: response.data.status,
        error: response.data.error || {},
        createdAt: new Date(), // You can also use response.created_at if available
    };
    const paymentFailure = new paymentFailure(failureData);
    await paymentFailure.save();
    return res.status(201).json({ message: 'Transcation Failed',
      payoutId:response.data.id,
      amount: response.data.amount,
      status: response.data.status,
      error: response.data.error || {},
      success:false,
      orderId:orderId
      });
}
 

});



app.post('/index' ,AuthMiddleware,async(req,res)=>{
console.log("request received for token check",req);
res.status(200).json({ message: 'Token is valid', success: true });
});


app.get("/", (req, res) => {
  res.json({ message: "Welcome to  nodejs flutter application." });
});

// Graceful shutdown
process.on('SIGINT', () => {
   mongoose.connection.close(() => {
       console.log('MongoDB connection closed');
       process.exit(0);
   });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0" ,() => {
    console.log(`Server started on port ${PORT}`);
})


