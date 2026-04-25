import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    items: [
      {
        productId: String,
        name: String,
        size: String,
        quantity: Number,
        price: Number,
      },
    ],
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    status: { type: String, default: 'paid' },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
