import { connectDB } from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import Broadcast from '@/models/Broadcast';
import { getAdminFromRequest } from '@/lib/auth';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  try {
    const admin = await getAdminFromRequest(request);
    if (!admin) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!resend) {
      return Response.json({ success: false, error: 'Email service not configured' }, { status: 503 });
    }

    const { subject, message } = await request.json();

    if (!subject?.trim() || !message?.trim()) {
      return Response.json({ success: false, error: 'Subject and message are required' }, { status: 400 });
    }

    await connectDB();
    const subscribers = await Subscriber.find({}).lean();

    if (subscribers.length === 0) {
      return Response.json({ success: false, error: 'No subscribers found' }, { status: 404 });
    }

    // Send in batches of 50 (Resend batch limit)
    const emails = subscribers.map((s) => ({
      from: 'Schein <no-reply@schein.in>',
      to: s.email,
      subject,
      html: broadcastEmail(subject, message),
    }));

    const batchSize = 50;
    let sent = 0;
    let sendError = null;
    try {
      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        await resend.batch.send(batch);
        sent += batch.length;
      }
    } catch (err) {
      sendError = err.message;
    }

    const status = sendError ? (sent > 0 ? 'partial' : 'failed') : 'sent';
    await Broadcast.create({
      subject,
      message,
      sentCount: sent,
      totalSubscribers: subscribers.length,
      status,
      error: sendError,
    });

    if (sendError && sent === 0) {
      return Response.json({ success: false, error: sendError }, { status: 500 });
    }
    return Response.json({ success: true, sent, total: subscribers.length, status });
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
    const broadcasts = await Broadcast.find({}).sort({ createdAt: -1 }).limit(50).lean();
    return Response.json({ success: true, broadcasts });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

function broadcastEmail(subject, message) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#000000;padding:36px 48px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:0.3em;text-transform:uppercase;">SCHEIN</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:48px;">
            <h2 style="margin:0 0 24px;font-size:22px;font-weight:800;color:#000;letter-spacing:-0.5px;">${subject}</h2>
            <div style="font-size:15px;color:#52525b;line-height:1.8;white-space:pre-line;">${message}</div>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" style="margin-top:32px;">
              <tr>
                <td style="background:#000000;">
                  <a href="https://schein.in/shop" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;">
                    Shop Now →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 48px;"><hr style="border:none;border-top:1px solid #e4e4e7;margin:0;"></td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 48px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;color:#a1a1aa;">© ${new Date().getFullYear()} Schein. All rights reserved.</p>
            <p style="margin:0;font-size:11px;color:#a1a1aa;">Gate no-3, near M I Plaza, Judges Colony, Gaya, Bihar 823001</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
