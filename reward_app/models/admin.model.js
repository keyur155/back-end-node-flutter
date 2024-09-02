const mongoose = require("mongoose")

const AdminSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, enum: ['admin', 'super admin'], default: 'admin' }
    
  }, { timestamps: true });
  
  const Admin = mongoose.model('Admin', AdminSchema);
  
  module.exports = Admin;