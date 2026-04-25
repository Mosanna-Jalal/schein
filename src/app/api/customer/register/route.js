import { connectDB } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    if (!name?.trim() || !email?.trim() || !password) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectDB();
    const exists = await Customer.findOne({ email: email.toLowerCase() });
    if (exists) {
      return Response.json({ error: 'This email is already registered' }, { status: 400 });
    }

    const customer = await Customer.create({ name: name.trim(), email, password });
    const token = signToken({ id: customer._id, email: customer.email, name: customer.name, role: 'customer' });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Set-Cookie': `customer_token=${encodeURIComponent(token)}; Path=/; HttpOnly; Max-Age=${7 * 24 * 3600}; SameSite=Lax`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
