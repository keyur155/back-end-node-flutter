const mongoose = require('mongoose');

// Define the ProductCounter schema
const productCounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

// Create the ProductCounter model
const ProductCounter = mongoose.model('ProductCounter', productCounterSchema);

// Define the Stock schema
const stockSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
});

// Define the Product schema
const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true, // Ensure product IDs are unique
    required: true,
    default: function() {
      return `PROD-${new Date().getTime()}`; // Fallback productId
    }
  },
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
    type: String,
    required: true,
  },
  size: {
    type: [String],
    enum: ["L", "M", "XL", "XXL", "S"], // Ensures only specific sizes can be stored
  },
  color: {
    type: [String],
  },
  stock: [stockSchema],
  specifications: {
    type: Map,
    of: String,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.pre('save', async function(next) {
  const doc = this;
  console.log('Pre-save hook triggered for:', JSON.stringify(doc));
  
  if (doc.isNew) {
    try {
      const counter = await ProductCounter.findOneAndUpdate(
        { _id: 'productId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      
      if (!counter) {
        console.error('Counter not found or created');
        // Use fallback productId
        doc.productId = `PROD-${new Date().getTime()}`;
      } else {
        doc.productId = `PROD-${counter.seq.toString().padStart(5, '0')}`;
      }
      
      console.log('Generated productId:', doc.productId);
    } catch (error) {
      console.error('Error in pre-save hook:', error);
      // Use fallback productId
      doc.productId = `PROD-${new Date().getTime()}`;
    }
  }
  
  console.log('Final document before save:', JSON.stringify(doc));
  next();
});

// // Pre-save hook to auto-increment productId
// productSchema.pre('save', async function(next) {
//   const doc = this;
//   if (doc.isNew) { // Only auto-increment on new documents
//     try {
//       const counter = await ProductCounter.findByIdAndUpdate(
//         { _id: 'productId' }, // Unique identifier for product ID counter
//         { $inc: { seq: 1 } }, // Increment the sequence by 1
//         { new: true, upsert: true } // Create the document if it doesn't exist
//       );
//       doc.productId = `PROD-${counter.seq.toString().padStart(5, '0')}`; // Format ID (e.g., PROD-00001)
//     } catch (error) {
//       return next(error); // Pass the error to the next middleware
//     }
//   }
//   next();
// });

// Export the product model
const product_info = mongoose.model('product_info', productSchema);
module.exports = product_info;
// const mongoose = require('mongoose');
// const Category = require('./category_model');

// const productcounterSchema = new mongoose.Schema({
//   _id: {
//     type: String,
//     required: true
//   },
//   seq: {
//     type: Number,
//     default: 0
//   }
// });

// const ProductCounter = mongoose.model('ProductCounter', productcounterSchema);

// const stockSchema = new mongoose.Schema({
  
//     quantity: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//   });


// const productSchema = new mongoose.Schema({
//     productId: {
//         type: String,
//         unique: true, // Ensure product IDs are unique
//         required: true
//     },
//     name: {
//         type: String,
//         required: true,
//       },
//       description: {
//         type: String,
//         required: true,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//       category: {
//        type:String,
//         required: true,
//       },
      
//       size: {
//         type: [String],
//         enum: ["L", "M", "XL", "XXL", "S"], // Ensures only specific sizes can be stored
//       },
//       color: {
//         type: [String],
//         // enum: ["Red", "Yellow", "Black", "Blue", "Green"], // Ensures only specific colors can be stored
//       },
        
//       stock: [stockSchema],
//         specifications: {
//             type: Map,
//             of: String,
//         },
//         imageUrl: { // Add this field to store the image URL
//           type: String,
//           required: false, // Set to true if you want to make it mandatory
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       },

// })

// productSchema.pre('save', async function(next) {
//   const doc = this;
//   console.log('Pre-save hook triggered for:', doc);
//   if (doc.isNew) { // Only auto-increment on new documents
//     try {
//       const counter = await ProductCounter.findByIdAndUpdate(
//         { _id: 'productId' },
//         { $inc: { seq: 1 } },
//         { new: true, upsert: true }
//       );

      
//       if (!counter) {
//         console.error('Counter not found or created');
//         return next(new Error('Counter not found or created'));
//       }

//       doc.productId = `PROD-${counter.seq.toString().padStart(5, '0')}`;
//     } catch (error) {
//       console.error('Error generating productId:', error);
//       return next(error); // Pass the error to the next middleware
//     }
//   }
//   next();
// });

// // // Pre-save hook to auto-increment productId
// // productSchema.pre('save', async function(next) {
// //   const doc = this;
// //   console.log('Pre-save hook triggered for:', doc);
// //   if (doc.isNew) { // Only auto-increment on new documents
// //     const counter = await ProductCounter.findByIdAndUpdate(
// //       { _id: 'productId' }, // Unique identifier for product ID counter
// //       { $inc: { seq: 1 } }, // Increment the sequence by 1
// //       { new: true, upsert: true } // Create the document if it doesn't exist
// //     );
// //     doc.productId = `PROD-${counter.seq.toString().padStart(5, '0')}`; // Format ID (e.g., PROD-00001)
// //   }
// //   next();
// // });

// // export const product_info = mongoose.model('product_info', product);
// const product_info = mongoose.model('product_info',productSchema);
// module.exports = product_info;