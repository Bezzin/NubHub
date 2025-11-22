# NubHub - AI-Powered Ultrasound Gender Prediction

Full-stack ultrasound gender prediction service using Gemini AI with manual review capabilities.

## Features

- 🤖 **AI Analysis**: Gemini 3 Pro Vision analyzes ultrasound images using Nub Theory
- 💳 **Stripe Payments**: Secure checkout with £9.97 pricing
- 👨‍⚕️ **Manual Review**: Admin dashboard for reviewing unclear AI results
- ⏰ **2-Hour Guarantee**: Automatic refunds if results aren't delivered within 2 hours
- 📧 **Email Notifications**: Resend integration for result delivery
- 🔒 **Secure Storage**: Cloudflare R2 for image storage with signed URLs
- 💾 **Database**: Neon Postgres for submission tracking

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS (CDN)

**Backend:**
- Vercel Serverless Functions
- Neon Postgres (serverless)
- Cloudflare R2 (S3-compatible storage)
- Stripe (payments & refunds)
- Resend (email)
- Google Gemini AI

## Project Structure

```
nubhubfinal/
├── api/                    # Vercel serverless functions
│   ├── upload.ts          # POST /api/upload - Image upload & Stripe session
│   ├── webhook/
│   │   └── stripe.ts      # POST /api/webhook/stripe - Payment webhooks
│   ├── admin/
│   │   ├── pending.ts     # GET /api/admin/pending - Get pending reviews
│   │   └── review.ts      # POST /api/admin/review - Submit manual review
│   └── cron/
│       └── check-timeouts.ts  # POST /api/cron/check-timeouts - Refund checker
├── components/            # React components
│   ├── Confetti.tsx
│   ├── Icons.tsx
│   ├── NubInfo.tsx
│   └── PaymentModal.tsx
├── db/                    # Database
│   ├── schema.sql         # Postgres schema
│   └── client.ts          # Neon client & queries
├── pages/                 # Pages
│   └── AdminDashboard.tsx # Admin review dashboard
├── services/              # Services
│   ├── authService.ts     # Admin authentication
│   ├── emailService.ts    # Resend email templates
│   ├── geminiService.ts   # Frontend Gemini (NubInfo only)
│   ├── geminiService.backend.ts  # Backend Gemini AI
│   └── r2Service.ts       # Cloudflare R2 storage
├── App.tsx                # Main app component
├── index.tsx              # Entry point with routing
├── types.ts               # TypeScript interfaces
└── vercel.json            # Vercel configuration

```

## Environment Variables

Create a `.env.local` file with the following variables:

### Database
```bash
NEON_DATABASE_URL=postgresql://user:password@host/database
```

### Cloudflare R2
```bash
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
```

### Email (Resend)
```bash
RESEND_API_KEY=re_your_api_key
```

### Stripe
```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Gemini AI
```bash
GEMINI_API_KEY=your_gemini_api_key
```

### Admin & Security
```bash
# Generate password hash: node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
ADMIN_PASSWORD_HASH=$2a$10$your_bcrypt_hash

# For Vercel cron authentication
CRON_SECRET=your_random_secret_string

# Your production URL
FRONTEND_URL=https://your-domain.vercel.app
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup (Neon)

1. Create a Neon account at https://neon.tech
2. Create a new project and database
3. Run the schema:
```bash
psql $NEON_DATABASE_URL -f db/schema.sql
```

### 3. Cloudflare R2 Setup

1. Create Cloudflare account at https://cloudflare.com
2. Go to R2 Object Storage
3. Create a new bucket (e.g., "nubhub-images")
4. Create an API token with R2 edit permissions
5. Add credentials to `.env.local`

### 4. Resend Setup

1. Create account at https://resend.com
2. Verify your domain or use the test domain
3. Create an API key
4. Update `FROM_EMAIL` in `services/emailService.ts` to your verified domain

### 5. Stripe Setup

1. Create Stripe account at https://stripe.com
2. Get your secret key from Dashboard → Developers → API Keys
3. Create webhook endpoint:
   - URL: `https://your-domain.vercel.app/api/webhook/stripe`
   - Events: `checkout.session.completed`
4. Copy webhook secret to `.env.local`
5. (Optional) Create promo codes in Stripe Dashboard

### 6. Admin Password

Generate a bcrypt hash for your admin password:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password-here', 10))"
```

Add the hash to `.env.local` as `ADMIN_PASSWORD_HASH`

## Run Locally

```bash
npm run dev
```

Visit:
- Main app: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

**Note:** Local development won't have working API endpoints. You'll need to deploy to Vercel or use Vercel CLI for full functionality.

## Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/nubhub)

### Manual Deploy

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`

5. Configure Stripe webhook:
   - Use your production URL: `https://your-domain.vercel.app/api/webhook/stripe`

## User Flow

1. User uploads ultrasound image
2. Payment modal collects email
3. Image uploaded to R2, Stripe Checkout Session created
4. User redirects to Stripe to pay £9.97
5. **Payment Success** → Webhook triggers AI analysis
6. **If Boy/Girl:** Email sent immediately with results
7. **If Unclear:** Marked for manual review, "Results in 2 hours" email sent
8. Admin reviews unclear cases in dashboard
9. Admin selects Boy/Girl → Result emailed to user
10. **Timeout:** Cron job checks every 30min, refunds submissions >2hrs old

## Admin Dashboard

Access at `/admin`

**Login:** Use the password you configured in `ADMIN_PASSWORD_HASH`

**Features:**
- View all pending reviews
- See ultrasound images with signed URLs
- View AI analysis (if available)
- Select Boy/Girl to send result
- Auto-refresh pending list

## API Endpoints

### POST /api/upload
Upload image and create Stripe session
```json
{
  "email": "user@example.com",
  "image": "data:image/jpeg;base64,...",
  "promoCode": "SAVE10"
}
```

### POST /api/webhook/stripe
Stripe webhook handler (automated)

### GET /api/admin/pending
Get pending reviews (requires admin auth)

### POST /api/admin/review
Submit manual review
```json
{
  "submissionId": "uuid",
  "result": "Boy",
  "reviewerName": "Admin"
}
```

### POST /api/cron/check-timeouts
Check for timed-out submissions (Vercel Cron)

## Troubleshooting

### Webhook Not Working
1. Check Stripe webhook secret is correct
2. Verify webhook endpoint is accessible
3. Check Vercel function logs

### Images Not Loading
1. Verify R2 credentials
2. Check bucket name and endpoint
3. Ensure signed URL generation is working

### Emails Not Sending
1. Verify Resend API key
2. Check domain is verified
3. Update `FROM_EMAIL` in `emailService.ts`

### Admin Login Failing
1. Verify password hash is correct
2. Check bcrypt hash generation
3. Clear sessionStorage and try again

## Cost Estimates (Free Tiers)

- **Neon Postgres:** Free (0.5GB storage, 192hr compute/month)
- **Cloudflare R2:** Free (10GB storage, 1M Class A operations)
- **Resend:** Free (100 emails/day, 3k emails/month)
- **Vercel:** Free (100GB bandwidth, serverless functions)
- **Stripe:** No monthly fee (2.9% + 30p per transaction)

## License

MIT

## Support

For issues, please open a GitHub issue or contact support.
