import { connectDB } from '@/lib/mongodb';
import Customer from '@/models/Customer';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectDB();
    const customer = await Customer.findOne({ email: email.toLowerCase() });
    if (!customer) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await customer.comparePassword(password);
    if (!valid) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

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

export async function DELETE() {
  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Set-Cookie': 'customer_token=; Path=/; HttpOnly; Max-Age=0',
      'Content-Type': 'application/json',
    },
  });
}
