const mongoose = require("mongoose");


const voucherSchema = new mongoose.Schema(
            {
                
                voucher_code: {
                    type: String,
                    required: true,
                    unique: true,
                },
                category: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'VoucherCategory',
                    required: true,
                },
                discount_type: {
                    type: String,
                    enum: ['offer', 'cash'],
                    required: true,
                },
                discount_value: {
                    type: Number,
                    required: true,
                },
                valid_from: {
                    type: Date,
                    required: true,
                },
                valid_until: {
                    type: Date,
                    required: true,
                },
                is_active: {
                    type: Boolean,
                    default: true,
                },
            },
            {
                timestamps: true, // Automatically adds createdAt and updatedAt fields
            }
);

const Vouchers = mongoose.model('Vouchers', voucherSchema);

module.exports = Vouchers;
        
    