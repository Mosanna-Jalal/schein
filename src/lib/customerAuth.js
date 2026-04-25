import { verifyToken } from './auth';

export async function getCustomerFromRequest(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/customer_token=([^;]+)/);
  if (!tokenMatch) return null;
  return verifyToken(decodeURIComponent(tokenMatch[1]));
}
