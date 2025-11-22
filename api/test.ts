import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    message: 'API is working!',
    env: {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasNeonUrl: !!process.env.NEON_DATABASE_URL,
      hasR2Key: !!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    }
  });
}
