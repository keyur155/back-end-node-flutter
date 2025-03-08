// Import necessary modules
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
require('dotenv').config();
// Function to send OTP using Msg91 API
// async function sendOtp(phoneNumber) {
//   try {
//     const apiKey = process.env.MSG91_AUTH_KEY; // Replace this with your Msg91 API key
//     const templateId = process.env.MSG91_SENDER_ID; // Replace this with your Msg91 template ID
//     const otp = generateOTP(); // Assuming you have a function to generate OTP
//     console.log('Generated OTP:', otp);
//     const data = new URLSearchParams();
//     data.append('mobile', phoneNumber);
//     data.append('authkey', apiKey);
//     data.append('otp', otp);
//     data.append('template_id', templateId);

//     const msg91Response = await fetch('https://control.msg91.com/api/v5/otp', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: data,
//     });

//     const responseData = await msg91Response.json();
//     console.log(responseData); // Log the response from Msg91 API
//     return responseData; // Return the response from Msg91 API
//   } catch (error) {
//     console.error(error);
//     throw new Error('Failed to send OTP');
//   }
// }

async function sendOtp(target, type) {
  try {
    const otp = generateOTP();
    console.log('Generated OTP:', otp);
    console.log(target);
    if (type === 'phone') {
      console.log("type is phone");
      const apiKey = process.env.MSG91_AUTH_KEY; // Replace this with your Msg91 API key
      const templateId = process.env.MSG91_SENDER_ID; // Replace this with your Msg91 template ID

      const data = new URLSearchParams();
      data.append('mobile', target);
      data.append('authkey', apiKey);
      data.append('otp', otp);
      data.append('template_id', templateId);

      const msg91Response = await fetch('https://control.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      });

      const responseData = await msg91Response.json();
      console.log(responseData); // Log the response from Msg91 API

      if (responseData.type !== 'success') {
        throw new Error('Failed to send OTP via phone');
      }
    } else if (type === 'email') {
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // or your preferred email service
        auth: {
          user: process.env.EMAIL_USER, // replace with your email
          pass:process.env.EMAIL_PASSWORD, // replace with your email password
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: target,
        subject: 'Your  OTP Verification code',
        text: `Your OTP code is ${otp}`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to email: ${target}`);
    } else {
      throw new Error('Invalid type specified');
    }

    return { type: 'success', otp: otp }; // Include OTP in the response for saving in DB
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send OTP');
  }
}
// Function to generate OTP
function generateOTP() {
  // Your OTP generation logic here
  // For simplicity, let's assume it generates a 6-digit random number
  return Math.floor(1000 + Math.random() * 9000);
}

module.exports = sendOtp;

// // Import necessary modules
// const fetch = require('node-fetch');
// const nodemailer = require('nodemailer');
// require('dotenv').config();
// // Function to send OTP using Msg91 API
// // async function sendOtp(phoneNumber) {
// //   try {
// //     const apiKey = process.env.MSG91_AUTH_KEY; // Replace this with your Msg91 API key
// //     const templateId = process.env.MSG91_SENDER_ID; // Replace this with your Msg91 template ID
// //     const otp = generateOTP(); // Assuming you have a function to generate OTP
// //     console.log('Generated OTP:', otp);
// //     const data = new URLSearchParams();
// //     data.append('mobile', phoneNumber);
// //     data.append('authkey', apiKey);
// //     data.append('otp', otp);
// //     data.append('template_id', templateId);

// //     const msg91Response = await fetch('https://control.msg91.com/api/v5/otp', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/x-www-form-urlencoded',
// //       },
// //       body: data,
// //     });

// //     const responseData = await msg91Response.json();
// //     console.log(responseData); // Log the response from Msg91 API
// //     return responseData; // Return the response from Msg91 API
// //   } catch (error) {
// //     console.error(error);
// //     throw new Error('Failed to send OTP');
// //   }
// // }

// async function sendOtp(target, type) {
//   try {
//     const otp = generateOTP();
//     console.log('Generated OTP:', otp);
//     console.log(target);
//     if (type === 'phone') {
//       console.log("type is phone");
//       const apiKey = process.env.MSG91_AUTH_KEY; // Replace this with your Msg91 API key
//       const templateId = process.env.MSG91_SENDER_ID; // Replace this with your Msg91 template ID

//       const data = new URLSearchParams();
//       data.append('mobile', target);
//       data.append('authkey', apiKey);
//       data.append('otp', otp);
//       data.append('template_id', templateId);

//       const msg91Response = await fetch('https://control.msg91.com/api/v5/otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: data,
//       });

//       const responseData = await msg91Response.json();
//       console.log(responseData); // Log the response from Msg91 API

//       if (responseData.type !== 'success') {
//         throw new Error('Failed to send OTP via phone');
//       }
//     } else if (type === 'email') {
//     console.log('EMAIL_USER:', process.env.EMAIL_USER);
//     console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD);
//       const transporter = nodemailer.createTransport({
//         service: 'Gmail', // or your preferred email service
//         auth: {
//           user: process.env.EMAIL_USER, // replace with your email
//           pass:process.env.EMAIL_PASSWORD, // replace with your email password
//         },
//       });

//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: target,
//         subject: 'Your  OTP Verification code',
//         text: `Your OTP code is ${otp}`,
//       };

//       await transporter.sendMail(mailOptions);
//       console.log(`OTP sent to email: ${target}`);
//     } else {
//       throw new Error('Invalid type specified');
//     }

//     return { type: 'success', otp: otp }; // Include OTP in the response for saving in DB
//   } catch (error) {
//     console.error(error);
//     throw new Error('Failed to send OTP');
//   }
// }
// // Function to generate OTP
// function generateOTP() {
//   // Your OTP generation logic here
//   // For simplicity, let's assume it generates a 6-digit random number
//   return Math.floor(1000 + Math.random() * 9000);
// }

// module.exports = sendOtp;

