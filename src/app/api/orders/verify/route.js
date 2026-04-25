import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems, amount, customerId } =
      await request.json();

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return Response.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    await connectDB();

    // Save order
    await Order.create({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount,
      customerId: customerId || null,
      items: (cartItems || []).map((i) => ({
        productId: i._id,
        name: i.name,
        size: i.size || '',
        quantity: i.quantity,
        price: i.price,
      })),
    });

    // Decrement stock (floor at 0)
    for (const item of cartItems || []) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity },
      });
      // Ensure stock doesn't go negative
      await Product.findOneAndUpdate(
        { _id: item._id, stock: { $lt: 0 } },
        { $set: { stock: 0 } }
      );
    }

    return Response.json({ success: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
