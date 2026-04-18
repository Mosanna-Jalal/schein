import crypto from 'crypto';

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return Response.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    return Response.json({ success: true, paymentId: razorpay_payment_id, orderId: razorpay_order_id });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
