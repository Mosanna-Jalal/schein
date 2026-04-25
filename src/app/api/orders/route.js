import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(100).lean();
    return Response.json({ success: true, orders });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
