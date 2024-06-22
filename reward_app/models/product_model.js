import mongoose from "mongoose"


const stockSchema = new mongoose.Schema({
    size: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  });
  

const product = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
      size: {
        type: String,
      },
      stock: [stockSchema],
        specifications: {
            type: Map,
            of: String,
        },
      createdAt: {
        type: Date,
        default: Date.now,
      },

})

export const product_info = mongoose.model('product_info', product);