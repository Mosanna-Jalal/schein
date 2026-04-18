import { connectDB } from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const count = await Subscriber.countDocuments();
    return Response.json({ success: true, count });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
