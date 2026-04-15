import { signToken, verifyToken } from '@/lib/auth';

// POST /api/auth  — login
export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const validUser = username === process.env.ADMIN_USERNAME;
    const validPass = password === process.env.ADMIN_PASSWORD;

    if (!validUser || !validPass) {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ username, role: 'admin' });

    const response = Response.json({ success: true, message: 'Logged in' });
    response.headers.set(
      'Set-Cookie',
      `admin_token=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${7 * 24 * 3600}; SameSite=Strict`
    );
    return response;
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/auth  — logout
export async function DELETE() {
  const response = Response.json({ success: true, message: 'Logged out' });
  response.headers.set(
    'Set-Cookie',
    'admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict'
  );
  return response;
}

// GET /api/auth  — check session
export async function GET(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
  if (!tokenMatch) {
    return Response.json({ success: false, authenticated: false }, { status: 401 });
  }

  const payload = verifyToken(decodeURIComponent(tokenMatch[1]));
  if (!payload) {
    return Response.json({ success: false, authenticated: false }, { status: 401 });
  }

  return Response.json({ success: true, authenticated: true, user: payload });
}
