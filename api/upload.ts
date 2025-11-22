import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createSubmission, updateStripeSession } from './db/client';
import { uploadImage, generateUniqueFileName, validateImage } from './services/r2Service';

let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
  }
  return stripe;
}

/**
 * POST /api/upload
 * Upload ultrasound image and create Stripe Checkout Session
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== Upload handler called ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers));

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate environment variables first
  console.log('Checking environment variables...');
  if (!process.env.NEON_DATABASE_URL) {
    console.error('NEON_DATABASE_URL is not set');
    return res.status(500).json({ error: 'Database configuration error', details: 'NEON_DATABASE_URL missing' });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not set');
    return res.status(500).json({ error: 'Payment configuration error', details: 'STRIPE_SECRET_KEY missing' });
  }
  if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
    console.error('CLOUDFLARE_R2_ACCESS_KEY_ID is not set');
    return res.status(500).json({ error: 'Storage configuration error', details: 'R2 credentials missing' });
  }
  console.log('Environment variables OK');

  try {
    console.log('Starting request processing...');
    // Parse JSON body with base64 image
    let data;
    try {
      if (typeof req.body === 'string') {
        data = JSON.parse(req.body);
      } else {
        data = req.body;
      }
    } catch (e) {
      console.error('JSON parse error:', e);
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const { email, image, promoCode } = data;

    if (!email || !image) {
      return res.status(400).json({ error: 'Missing required fields: email, image' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Extract base64 image data
    let base64Data: string;
    let mimeType: string;

    if (image.startsWith('data:')) {
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ error: 'Invalid image data format' });
      }
      mimeType = matches[1];
      base64Data = matches[2];
    } else {
      return res.status(400).json({ error: 'Image must be in data URL format (data:image/...;base64,...)' });
    }

    // Convert base64 to buffer
    console.log('Converting base64 to buffer...');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    console.log('Image buffer size:', imageBuffer.length);

    // Validate image
    console.log('Validating image...');
    const validation = validateImage(mimeType, imageBuffer.length);
    if (!validation.isValid) {
      console.error('Image validation failed:', validation.error);
      return res.status(400).json({ error: validation.error });
    }
    console.log('Image validation passed');

    // Generate unique filename
    console.log('Generating unique filename...');
    const fileName = generateUniqueFileName(`ultrasound.${mimeType.split('/')[1]}`);
    console.log('Generated filename:', fileName);

    // Upload to Cloudflare R2
    console.log('Uploading to R2...');
    const imageUrl = await uploadImage(imageBuffer, fileName, mimeType);
    console.log('R2 upload complete:', imageUrl);

    // Create submission in database
    console.log('Creating submission in database...');
    const submission = await createSubmission({
      email,
      image_url: imageUrl,
      promo_code: promoCode || undefined,
    });
    console.log('Submission created:', submission.id);

    // Create Stripe Checkout Session
    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}`;

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'NubHub Gender Prediction Analysis',
              description: 'Expert AI analysis of your ultrasound scan using Nub Theory',
              images: ['https://nubhub.com/logo.png'], // Update with your actual logo URL
            },
            unit_amount: 997, // £9.97 in pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: {
        submissionId: submission.id,
      },
    };

    // Add promo code if provided
    if (promoCode) {
      // Try to find the promo code in Stripe
      try {
        const promotionCodes = await getStripe().promotionCodes.list({
          code: promoCode,
          active: true,
          limit: 1,
        });

        if (promotionCodes.data.length > 0) {
          sessionConfig.discounts = [
            {
              promotion_code: promotionCodes.data[0].id,
            },
          ];
        }
      } catch (error) {
        console.warn('Promo code lookup failed:', error);
        // Continue without promo code if lookup fails
      }
    }

    console.log('Creating Stripe checkout session...');
    const session = await getStripe().checkout.sessions.create(sessionConfig);
    console.log('Stripe session created:', session.id);

    // Update submission with Stripe session ID
    console.log('Updating submission with Stripe session ID...');
    await updateStripeSession(submission.id, session.id);
    console.log('Submission updated');

    // Return submission ID and checkout URL
    console.log('=== Upload successful ===');
    return res.status(200).json({
      submissionId: submission.id,
      checkoutUrl: session.url,
    });

  } catch (error) {
    console.error('=== Upload endpoint error ===');
    console.error('Error:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    return res.status(500).json({
      error: 'Failed to process upload',
      details: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : 'Unknown',
    });
  }
};
