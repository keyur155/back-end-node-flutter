const mongoose = require('mongoose');

const paymentFailureSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    payoutId: { type: String, required: true },
    fundAccountId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, required: true },
    error: {
        source: { type: String, default: null },
        reason: { type: String, default: null },
        description: { type: String, default: null },
        code: { type: String, default: null },
        step: { type: String, default: null },
        metadata: { type: Object, default: {} },
    },
    orderId:{
        type:String,
        required:true
      },
    createdAt: { type: Date, default: Date.now },
});

const PaymentFailure = mongoose.model('PaymentFailure', paymentFailureSchema);
module.exports = PaymentFailure;