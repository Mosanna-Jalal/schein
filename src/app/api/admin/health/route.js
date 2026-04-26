import { connectDB } from '@/lib/mongodb';
import { getAdminFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

async function timed(fn) {
  const start = Date.now();
  try {
    const info = await fn();
    return { ok: true, latencyMs: Date.now() - start, info };
  } catch (error) {
    return { ok: false, latencyMs: Date.now() - start, error: error.message };
  }
}

async function checkMongo() {
  await connectDB();
  // Ping the DB
  await mongoose.connection.db.admin().ping();
  const collections = await mongoose.connection.db.listCollections().toArray();
  return { collections: collections.length, dbName: mongoose.connection.db.databaseName };
}

async function checkResend() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not set');
  const res = await fetch('https://api.resend.com/domains', {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
  });
  if (!res.ok) throw new Error(`Resend API ${res.status}`);
  const data = await res.json();
  const domains = (data.data || []).map((d) => `${d.name} (${d.status})`);
  return { domains };
}

async function checkRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not set');
  }
  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString('base64');
  const res = await fetch('https://api.razorpay.com/v1/payments?count=1', {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Razorpay API ${res.status}: ${body.slice(0, 100)}`);
  }
  const data = await res.json();
  return { reachable: true, recentPayments: data.count };
}

async function checkSite() {
  const url = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || 'schein.in'}`;
  const res = await fetch(url, { method: 'HEAD' });
  if (!res.ok) throw new Error(`Site returned ${res.status}`);
  return { url, status: res.status };
}

export async function GET(request) {
  const admin = await getAdminFromRequest(request);
  if (!admin) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const [mongo, resend, razorpay, site] = await Promise.all([
    timed(checkMongo),
    timed(checkResend),
    timed(checkRazorpay),
    timed(checkSite),
  ]);

  const checks = { mongo, resend, razorpay, site };
  const allOk = Object.values(checks).every((c) => c.ok);

  return Response.json({
    success: true,
    overall: allOk ? 'healthy' : 'degraded',
    checkedAt: new Date().toISOString(),
    deploy: {
      commit: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
      url: process.env.VERCEL_URL || 'localhost',
      region: process.env.VERCEL_REGION || 'unknown',
    },
    checks,
  });
}
