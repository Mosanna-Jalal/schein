import { connectDB } from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }

    await connectDB();

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return Response.json({ success: false, error: 'Already subscribed' }, { status: 409 });
    }

    await Subscriber.create({ email });

    // Send welcome email (skipped if Resend not configured)
    if (resend) {
      await resend.emails.send({
        from: 'Schein <no-reply@schein.in>',
        to: email,
        subject: 'Welcome to Schein — You\'re on the list.',
        html: welcomeEmail(email),
      });
    }

    return Response.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

function welcomeEmail(email) {
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
            <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#a1a1aa;">Welcome</p>
            <h2 style="margin:0 0 24px;font-size:24px;font-weight:800;color:#000;letter-spacing:-0.5px;">You're on the list.</h2>
            <p style="margin:0 0 20px;font-size:15px;color:#52525b;line-height:1.7;">
              Thank you for subscribing to Schein. You'll be the first to know about new collections, exclusive restocks, and member-only offers.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#52525b;line-height:1.7;">
              In the meantime, explore what's already available in the store.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
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
            <p style="margin:0;font-size:11px;color:#a1a1aa;">
              Gate no-3, near M I Plaza, Judges Colony, Gaya, Bihar 823001
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
