import { connectDB } from '@/lib/mongodb';
import Franchise from '@/models/Franchise';
import { getAdminFromRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, city, state, investment } = body;

    if (!name || !email || !phone || !city || !state || !investment) {
      return Response.json({ success: false, error: 'All required fields must be filled' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    await connectDB();
    const inquiry = await Franchise.create(body);
    return Response.json({ success: true, inquiry });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const inquiries = await Franchise.find({}).sort({ createdAt: -1 }).lean();
    return Response.json({ success: true, inquiries });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const { id, status } = await request.json();
    await connectDB();
    await Franchise.findByIdAndUpdate(id, { status });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
