

const mongoose =require('mongoose');

const paymentSuccessSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          payoutId:{
            type:String,
            required:true
          },
          fundAccountId: {
            type: String,
            required: true
          },
          amount :{
            type : Number,
            required:true
          },
          fees: { type: Number, required: true },
          tax: { type: Number, required: true },
          status: { type: String, required: true },
          referenceId: { type: String, required: true },
          orderId:{
            type:String,
            required:true
          },
          createdAt: { type: Date, default: Date.now },
        //  merchantId: { type: String, required: true },

    }

)

const PaymentSuccess = mongoose.model('PaymentSuccess', paymentSuccessSchema);
module.exports = PaymentSuccess;
// request received payout { fundAccount_id: 'fa_P6QFFvATOEf1cD', amount: 10 }
// {"id":"pout_P9DBGquXEh6ewy","entity":"payout","fund_account_id":"fa_P6QFFvATOEf1cD","amount":1000,
// "currency":"INR","notes":{"random_key_1":"Make it so.","random_key_2":"Tea. Earl Grey. Hot."},"fees":236,"tax":36,"status":
// "processing","purpose":"refund","utr":null,"mode":"UPI","reference_id":"Acme Transaction ID 12345",
// "narration":"Acme Corp Fund Transfer","batch_id":null,"failure_reason":null,"created_at":1728973045,
// "fee_type":null,"status_details":{"reason":null,"description":null,"source":null},"merchant_id":"OLjHlQzqY2Onu4",
// "status_details_id":null,"error":{"source":null,"reason":null,"description":null,"code":"NA","step":"NA","metadata":{}}}