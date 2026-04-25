import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCustomerFromRequest } from '@/lib/customerAuth';

export async function GET(request) {
  const user = await getCustomerFromRequest(request);
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const orders = await Order.find({ customerId: user.id }).sort({ createdAt: -1 });
  return Response.json({ orders });
}
