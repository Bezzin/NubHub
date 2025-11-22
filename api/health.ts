import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Health check called');

  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasNeonUrl: !!process.env.NEON_DATABASE_URL,
      hasR2Key: !!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    }
  });
}
