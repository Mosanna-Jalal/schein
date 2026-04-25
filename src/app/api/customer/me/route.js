import { connectDB } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { getCustomerFromRequest } from '@/lib/customerAuth';

export async function GET(request) {
  const user = await getCustomerFromRequest(request);
  if (!user) return Response.json({ authenticated: false }, { status: 401 });

  await connectDB();
  const customer = await Customer.findById(user.id).select('-password');
  if (!customer) return Response.json({ authenticated: false }, { status: 401 });

  return Response.json({ authenticated: true, customer });
}
