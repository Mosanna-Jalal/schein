# Schein — Operations Runbook

This document covers everything the site owner needs to operate **schein.in** day-to-day. Bookmark it.

---

## 1. Where everything lives

| Service | What it does | Login URL | Account |
|---------|-------------|-----------|---------|
| **Vercel** | Hosts the website | https://vercel.com | scheinindia@gmail.com (Hobby tier, free) |
| **MongoDB Atlas** | Database — products, orders, customers | https://cloud.mongodb.com | scheinindia@gmail.com (M0 free) |
| **Razorpay** | Payment processing | https://dashboard.razorpay.com | (client's Razorpay account) |
| **Resend** | Transactional emails (newsletter, welcome) | https://resend.com | scheinindia@gmail.com (Free: 3000/month) |
| **GoDaddy** | Domain registration + DNS | https://godaddy.com | (client's GoDaddy account) |
| **GitHub (developer-side)** | Source code | https://github.com/Mosanna-Jalal/schein | Owned by developer; client doesn't need access |

---

## 2. Daily admin operations

All admin actions happen at: **https://schein.in/admin**

Login with admin credentials (set in environment as `ADMIN_USERNAME` / `ADMIN_PASSWORD`).

### Add a product
1. Click **+ Add Product**
2. Fill name, price (in rupees), category (Kid / Women / Unisex / Accessories)
3. Upload main image + up to 4 gallery images (or paste URLs)
4. Set initial stock count
5. Toggle **Featured** to show on homepage
6. **Save**

### Edit/disable a product
- Click the **pencil** icon in the products row
- Set **stock to 0** to mark out-of-stock without deleting (keeps order history intact)

### View orders
- Scroll to **Recent Orders** section in admin
- Shows: date, payment ID, items, amount, status (last 100)
- Click **Refresh** to reload

### Send a newsletter
- Scroll to **Newsletter Broadcast**
- Subject + Message → **Send to Subscribers**
- Free Resend tier: 100 emails/day, 3000/month — enough for ~30 broadcasts/month at current subscriber count

### Site Health Check
- Scroll to **System Health** section in admin
- Click **Run Check** — verifies MongoDB, Razorpay, Resend, and the site itself in real time
- Use this anytime the site feels slow or something seems off

---

## 3. Common issues & fixes

### Site is down / slow
1. Run **System Health** check in admin
2. Or: open https://www.vercel-status.com — Vercel may be having an incident
3. Or run from your terminal: `node scripts/smoke-test.mjs https://schein.in`

### Payments failing
1. Check **System Health → razorpay** — should be green
2. Log into Razorpay dashboard → **Payments** → look for recent failed payments → see `error_description` for cause
3. Common causes:
   - Account not fully activated (KYC pending) — log into Razorpay, complete activation
   - Domain not registered — Razorpay Settings → Websites → add `schein.in`
   - Bank/UPI temporary issues — usually resolve within hours

### Emails not sending
1. Check **System Health → resend** — should be green
2. Log into Resend dashboard → **Logs** → see recent send attempts
3. Free tier limit hit? Check **Settings → Usage**
4. Domain unverified? Check **Domains** — `schein.in` should be Verified

### Customer says "I paid but got no order"
1. Admin → **Recent Orders** → search by customer's email (or amount/date)
2. If order exists → already saved, just send confirmation manually
3. If not → log into Razorpay → find the payment → if status = **captured** but no order in DB, that's a bug; contact developer

### Product image not showing
- Images uploaded via the admin go into Vercel's filesystem which is **ephemeral** (gets wiped on each deploy)
- For permanent product images, paste an image URL from Cloudinary / Imgur / S3 instead of uploading
- Long-term fix: developer should integrate Vercel Blob or Cloudinary

---

## 4. Updating the website (developer)

Code changes are deployed by the developer via:
```bash
git push
vercel --prod
```

There is **no auto-deploy** — every change requires a manual deploy. Client doesn't need to do anything for site updates.

---

## 5. Billing & limits

| Service | Plan | Monthly cost | Limits |
|---------|------|--------------|--------|
| Vercel | Hobby | ₹0 | 100 GB bandwidth, 100 GB-hours functions, resets monthly |
| MongoDB Atlas | M0 | ₹0 | 512 MB storage, shared cluster |
| Razorpay | Standard | 2% per txn | No fixed cost; per-transaction fee |
| Resend | Free | ₹0 | 3000 emails/month, 100/day |
| GoDaddy | — | ~₹1000/year | Domain renewal annually |

If the store grows past these limits, upgrades are paid (Vercel Pro = $20/mo, Resend Pro = $20/mo).

---

## 6. Backups

- **Code** — backed up on developer's GitHub
- **Database** — MongoDB Atlas takes automated daily snapshots even on free tier (kept for 7 days). To export manually: MongoDB Compass → Export Collection → JSON
- **Orders** — visible forever in admin Recent Orders + as raw documents in MongoDB

---

## 7. Emergency contacts

- **Site / code issues**: developer (Mosanna Jalal — mjiraqui322@gmail.com)
- **Payment / refund**: Razorpay support — support@razorpay.com
- **Domain / DNS**: GoDaddy support
- **Email delivery**: Resend support — support@resend.com

---

## 8. Security notes

- Never share admin password or API keys publicly
- Never commit `.env.local` or any file containing credentials to public Git
- If a credential leaks: rotate immediately (Razorpay/Resend/Vercel all let you regenerate keys)
- Keep `RESEND_API_KEY`, `RAZORPAY_KEY_SECRET`, `MONGODB_URI`, `JWT_SECRET` confidential

---

_Last updated: 2026-04-26_
