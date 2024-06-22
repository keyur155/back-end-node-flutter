import mongoose from "mongoose"

const categories = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
      },
      description: {
        type: String,
        required: true,
      },
      sizes: [{
        type: String,
      }],

});

export const Category = mongoose.model('Category', categories);