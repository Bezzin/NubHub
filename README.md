# Nub Theory Gender Predictor

A Next.js 14 app for AI-powered baby gender prediction from 12-week ultrasound scans.

## 🎯 What We've Built

### ✅ Complete Features

1. **Landing Page** (`/`)
   - Hero section with clear value proposition
   - Pricing display (£9.97)
   - How It Works section (3 steps)
   - Trust signals and FAQ
   - Referral code detection from URL (?ref=CODE)
   - Responsive design with mobile-first approach

2. **Upload Page** (`/upload?session_id={CHECKOUT_SESSION_ID}`)
   - Payment session verification
   - Drag & drop image upload with preview
   - Client-side image compression
   - File type and size validation
   - Success confirmation screen

3. **Admin Dashboard** (`/admin`)
   - Password authentication
   - Predictions list with filters (all/pending/sent/refunded)
   - Analytics cards (totals, revenue, etc.)
   - Image review interface with action buttons
   - Confirm Boy/Girl or Issue Refund

4. **Stripe Integration**
   - Checkout session creation with referral tracking
   - Payment verification
   - Refund processing

5. **Supabase Database**
   - `predictions` table with all required fields
   - `referral_codes` table for influencer tracking
   - `scan-images` storage bucket (private)

6. **Gemini AI Analysis**
   - Image analysis using Gemini 2.0 Flash Vision
   - Nub theory prompt with detailed instructions
   - Confidence scoring
   - Results stored in database

7. **Email System**
   - Result email template (Boy/Girl)
   - Unclear image / refund email template
   - HTML and plain text versions
   - Ready for Resend MCP integration

8. **Telegram Notifications**
   - New prediction alerts to admin
   - Integration ready with bot token

## 📋 What Still Needs to Be Done

### High Priority

1. **Referral System Admin Interface**
   - Create `/admin/referrals` page
   - List all referral codes with stats
   - Create new codes UI
   - Mark commissions as paid
   - Show commission balances

2. **Refund Request Page** (`/refund/[id]`)
   - Customer-facing refund request form
   - Upload 20-week confirmation scan
   - Email + prediction ID verification

3. **Integrate Resend MCP**
   - Replace console.log in email routes with actual Resend MCP calls
   - You have the Resend MCP available - just need to call it from the API routes
   - Test email delivery

4. **Add Real Stripe API Keys**
   - Update `.env.local` with your Stripe keys
   - Create the product in Stripe dashboard
   - Test payments in test mode

5. **Add Real Gemini API Key**
   - Update `.env.local` with your Gemini API key
   - Test AI image analysis

### Medium Priority

6. **Error Handling**
   - Add better error messages throughout
   - Handle edge cases (network failures, etc.)
   - Add retry logic where appropriate

7. **Testing**
   - Test complete user flow end-to-end
   - Test admin workflow
   - Test mobile responsiveness
   - Test with real ultrasound images

8. **Stripe Webhook** (Optional but recommended)
   - Set up webhook endpoint to handle payment events
   - More reliable than relying on session verification

### Low Priority (Post-MVP)

9. **Referral System Enhancements**
   - Add shareable referral links
   - Influencer dashboard
   - Automatic commission calculations

10. **Additional Features**
    - Multiple image upload
    - WhatsApp delivery option
    - Admin notes on predictions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project (already set up: `ybssyeoqidcrzfqjkhtv.supabase.co`)
- Stripe account
- Resend account
- Gemini API key
- Telegram bot token

### Installation

```bash
cd app
npm install
```

### Environment Variables

Update `app/.env.local` with your actual API keys:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://ybssyeoqidcrzfqjkhtv.supabase.co
SUPABASE_SERVICE_KEY=your_service_key

# Stripe - ADD YOUR KEYS
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...

# Resend - ADD YOUR KEY
RESEND_API_KEY=re_...

# Gemini AI - ADD YOUR KEY
GEMINI_API_KEY=AIzaSy...

# Telegram - ADD YOUR BOT INFO
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...

# Admin
ADMIN_PASSWORD=your_secure_password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

✅ Already complete! Tables and storage bucket created.

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app/
├── app/
│   ├── page.tsx                   # Landing page
│   ├── layout.tsx                 # Root layout
│   ├── globals.css               # Global styles
│   ├── upload/
│   │   └── page.tsx              # Upload page
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard
│   └── api/
│       ├── stripe/
│       │   └── create-checkout/  # Stripe checkout
│       ├── upload/
│       │   ├── route.ts          # Image upload
│       │   └── verify-session/   # Session verification
│       ├── analyze/
│       │   └── route.ts          # AI analysis
│       ├── admin/
│       │   ├── predictions/      # List predictions
│       │   └── confirm/          # Confirm results
│       ├── email/
│       │   ├── send-result/      # Send result email
│       │   └── send-unclear/     # Send unclear email
│       └── refund/
│           └── process/          # Process refund
├── components/
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── utils.ts                  # Utility functions
│   ├── supabase.ts              # Supabase client
│   └── telegram.ts              # Telegram notifications
├── .env.local                    # Environment variables
├── package.json
└── tailwind.config.ts
```

## 🎨 Design System

- **Colors:**
  - Primary (Blue): `#4A90E2`
  - Secondary (Pink): `#FFC0CB`
  - Neutral grays
- **Typography:** Inter font
- **Components:** shadcn/ui
- **Styling:** Tailwind CSS

## 🔐 Security Considerations

1. **Admin Authentication:**
   - Currently using simple password
   - For production, consider implementing proper auth (Supabase Auth)

2. **API Keys:**
   - Never commit `.env.local` to git
   - Use environment variables in Vercel

3. **Storage:**
   - `scan-images` bucket is private
   - Only accessible via signed URLs

4. **Payments:**
   - Use Stripe's test mode until ready
   - Verify webhook signatures in production

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables in Vercel

Add all environment variables from `.env.local` to Vercel project settings.

## 📊 Using the Admin Dashboard

1. Navigate to `/admin`
2. Enter admin password
3. View all predictions
4. Filter by status (pending/sent/refunded)
5. Click "Review" to view scan image
6. Click action button:
   - **Confirm Boy** - Sends Boy result email
   - **Confirm Girl** - Sends Girl result email
   - **Image Unclear - Refund** - Processes refund and sends unclear email

## 🧪 Testing Checklist

### Before Launch

- [ ] Test landing page on mobile
- [ ] Test Stripe checkout with test card
- [ ] Upload test image and verify it reaches admin dashboard
- [ ] Test AI analysis with real ultrasound image
- [ ] Confirm Boy result and verify email sent
- [ ] Confirm Girl result and verify email sent
- [ ] Test unclear/refund flow
- [ ] Test referral code tracking (?ref=TEST)
- [ ] Test admin dashboard on mobile
- [ ] Verify Telegram notifications work

### Test Credit Cards

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## 💡 Tips for Success

1. **Start with Test Mode:**
   - Use Stripe test keys
   - Test thoroughly before going live

2. **Monitor Closely:**
   - Check Telegram notifications
   - Review first predictions manually
   - Adjust AI confidence thresholds if needed

3. **Customer Service:**
   - Respond quickly to emails
   - Be generous with refunds
   - Build trust and reputation

4. **Marketing:**
   - Share in pregnancy forums
   - Target Facebook pregnancy groups
   - Consider influencer partnerships

5. **Iterate:**
   - Collect feedback
   - Track accuracy rate
   - Improve AI prompts based on results

## 🐛 Known Issues / TODOs

1. Email sending routes currently log instead of sending - need to integrate Resend MCP
2. Admin password stored in env - consider more robust auth
3. No webhook handler for Stripe events yet
4. Referral admin interface not built yet
5. Refund request page not built yet

## 📞 Support

For questions or issues during development:
- Check the logs in development console
- Review Supabase logs for database issues
- Check Stripe dashboard for payment issues
- Test Telegram bot connection with `/getMe` endpoint

## 🎉 Launch Day

1. Switch Stripe to live mode
2. Update environment variables
3. Test one real transaction
4. Post in pregnancy communities
5. Monitor closely
6. Respond to first customers ASAP

---

**Built with:**
- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Stripe
- Gemini 2.0 Flash
- Resend
- Telegram Bot API
