import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { amount, cartItems } = await request.json();

    if (!amount || amount < 1) {
      return Response.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `schein_${Date.now()}`,
      notes: {
        items: cartItems?.map((i) => `${i.name}${i.size ? ` (${i.size})` : ''} x${i.quantity}`).join(', ') || '',
      },
    });

    return Response.json({ success: true, orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error('Razorpay error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
