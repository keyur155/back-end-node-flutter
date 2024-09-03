// Import necessary modules
const fetch = require('node-fetch');
require('dotenv').config();
// Function to send OTP using Msg91 API
async function sendOtp(phoneNumber) {
  try {
    const apiKey = process.env.MSG91_AUTH_KEY; // Replace this with your Msg91 API key
    const templateId = process.env.MSG91_SENDER_ID; // Replace this with your Msg91 template ID
    const otp = generateOTP(); // Assuming you have a function to generate OTP
    console.log('Generated OTP:', otp);
    const data = new URLSearchParams();
    data.append('mobile', phoneNumber);
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
    return responseData; // Return the response from Msg91 API
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

