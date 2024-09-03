const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'daeqtblkw', // Replace with your Cloudinary cloud name
    api_key: '514668826354237',       // Replace with your Cloudinary API key
    api_secret: 'SIRPzC_Lj8Eo-kpC74OfbndV1lU', // Replace with your Cloudinary API secret
  });

  module.exports = cloudinary;