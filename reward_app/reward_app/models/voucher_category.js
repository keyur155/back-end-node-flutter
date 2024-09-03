const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const voucherCategoriesSchema = new mongoose.Schema({
    voucher_id:{
          type:Number,
    },
    // such as food ,fashion
    vouchers_type: {
        type: String,
        required: true,
        unique: true,
      },
      description: {
        type: String,
        required: true,
      }, 
      quantity_left: {
        type: Number,
        required: true,
        default:10,  // Default value can be set as per your requirement
    },   

},
    voucherCategoriesSchema.plugin(AutoIncrement, { inc_field: 'voucher_id', start_seq: 1000 })
);

const VoucherCategory = mongoose.model('VoucherCategory', voucherCategoriesSchema);

module.exports = VoucherCategory;