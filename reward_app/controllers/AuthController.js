// Import necessary modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const sendOtp = require('../Services/otpService');
const verifyOTP = require('../Services/verifyotp');
// Controller methods
const AuthController = {
  // Register a new user
  register: async (req, res) => {
    
    try {
      // Check if username already exists
      console.log("register page");
      const existingUser = await User.findOne({ phoneNumber: req.body.phoneNumber });
      if (existingUser) {
        return res.status(400).json({ message: 'Phone Number  already exists' });
      }

      const newUser = new User({
          phoneNumber: req.body.phoneNumber
        
        // password: hashedPassword
      });

      user = await newUser.save();
      res.json(user);
//      await sendOtp(req.body.phoneNumber);
   // Respond with success message
      return res.status(200).json({ 'message' : 'OTP sent successfully. Please verify your phone number' , 'user' : user});
//      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 'message' : 'Internal server error' });
    }
  },

  // Login an existing user
  login: async (req, res ) => {
   console.log("request recieved", req.body);
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
       const userResponse = {
            _id: user._id,
            phoneNumber: user.phoneNumber,
            // Add other necessary properties here
          }
//      const userJson = user.toJSON();
//      delete userJson.__v;
      console.log(userResponse.phoneNumber);

     await sendOtp(req.body.phoneNumber);
      return res.status(200).json({ message : 'OTP sent successfully. Please verify your phone number', 'user' :userResponse });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message : 'Internal server error' });
    }
  } ,

  verifyOTP: async (req ,res) => {

   try {
        const phoneNumber = req.body.phoneNumber;
        const enteredOTP = req.body.enteredOTP;
        const isVerified = await verifyOTP(phoneNumber, enteredOTP);

        if (isVerified) {
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
          res.status(200).json({ token });
        } else {
          res.status(400).json({ message: 'Invalid OTP' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }

//      try {
//      const phoneNumber = req.body.phoneNumber;
//      const enteredOTP = req.body.enteredOTP;
//      const isVerified = await verifyOTP(phoneNumber,enteredOTP);
//
//      if( isVerified){
//      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//      }
//      else{
//       res.status(200).json({ message: 'Invalid OTP' });
//      }
//},catch (error) {
//        console.error(error);
//        res.status(500).json({ message: 'Internal server error' });
//      }


}
module.exports = AuthController;




//        // Call your OTP verification service, for now let's assume the OTP verification is successful
//        // You might want to handle this part with Msg91 API
//        const isOTPValid = true;
//
//        if (isOTPValid) {
//          res.status(200).json({ message: 'OTP verified successfully' });
//        } else {
//          res.status(400).json({ message: 'Invalid OTP' });
//        }
//      } catch (error) {
//        console.error(error);
//        res.status(500).json({ message: 'Internal server error' });
//      }
//    }