const fetch = require('node-fetch');
require('dotenv').config();

async function verifyOtp(phoneNumber , enteredOTP) {
  try {
  console.log("requested" ,enteredOTP);
    const apiKey = process.env.MSG91_AUTH_KEY; // Replace this with your Msg91 API key
    const templateId = 'process.env.MSG91_SENDER_ID'; // Replace this with your Msg91 template ID

    const data = new URLSearchParams();
    data.append('mobile', phoneNumber);

    data.append('otp',enteredOTP);

    const msg91Response = await fetch('https://control.msg91.com/api/v5/otp/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'authkey': apiKey,
      },
      body: data,
    });

    const responseData = await msg91Response.json();
    console.log(responseData); // Log the response from Msg91 API
    return responseData; // Return the response from Msg91 API
  } catch (error) {
    console.error(error);
    throw new Error('Failed to verify  OTP');
  }
}

module.exports = verifyOtp;