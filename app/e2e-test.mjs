import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load env vars from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

const log = (step, msg) => console.log(`\n[${'STEP ' + step}] ${msg}`);
const ok = (msg) => console.log(`  [OK] ${msg}`);
const fail = (msg) => console.error(`  [FAIL] ${msg}`);

async function main() {
  console.log('='.repeat(60));
  console.log('  NubHub E2E Test — Full Flow');
  console.log('='.repeat(60));

  // ── STEP 1: Upload image to R2 ──────────────────────────────
  log(1, 'Uploading ultrasound image to R2...');

  const r2 = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });

  const imagePath = 'C:\\Users\\Nathaniel\\Downloads\\12-weeks-4-days-ultrasound-boy-or-girl-nub-theory-guesses-v0-rcoj26vw3ake1.jpg';
  const imageBuffer = readFileSync(imagePath);
  const timestamp = Date.now();
  const r2Key = `ultrasounds/${timestamp}-e2e-test.jpg`;

  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: imageBuffer,
    ContentType: 'image/jpeg',
  }));

  ok(`Image uploaded to R2: ${r2Key} (${(imageBuffer.length / 1024).toFixed(0)} KB)`);

  // ── STEP 2: Create prediction record in DB ─────────────────
  log(2, 'Creating prediction record in database...');

  const sql = neon(process.env.NEON_DATABASE_URL);
  const testEmail = 'e2e-test@nubhub.baby';
  const fakeSessionId = `cs_test_e2e_${timestamp}`;

  const rows = await sql`
    INSERT INTO predictions (
      stripe_session_id, stripe_payment_intent_id, customer_email,
      scan_image_url, scan_image_filename, referral_code, amount_paid, status
    ) VALUES (
      ${fakeSessionId}, ${'pi_test_e2e_' + timestamp}, ${testEmail},
      ${r2Key}, ${'e2e-test.jpg'}, ${null}, ${395}, ${'paid'}
    )
    RETURNING *
  `;

  const prediction = rows[0];
  ok(`Prediction created: ${prediction.id}`);
  ok(`Email: ${testEmail}`);

  // ── STEP 3: Generate signed URL (verify R2 access) ─────────
  log(3, 'Generating signed URL for image...');

  const signedUrl = await getSignedUrl(r2, new GetObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
  }), { expiresIn: 86400 });

  ok(`Signed URL generated (${signedUrl.substring(0, 80)}...)`);

  // ── STEP 4: Run Gemini AI analysis ─────────────────────────
  log(4, 'Calling Gemini AI for nub analysis...');

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  const prompt = `You are an expert at analyzing 12-week pregnancy ultrasound scans using the Nub Theory.

STEP-BY-STEP ANALYSIS — work through each step before making your prediction:

Step 1: IMAGE VALIDITY
- Is this an ultrasound image? If not, respond INVALID.
- Is it a side-profile (sagittal) view showing the baby's full body? If only a partial view or wrong angle, respond UNCLEAR.

Step 2: FIND THE SPINE
- Identify the baby's spine — the bright, curved line of vertebrae running along the back.

Step 3: FIND THE GENITAL TUBERCLE (NUB)
- Look between the baby's legs, near the base of the torso/rump area.
- The nub is a small bright protrusion. It is NOT the umbilical cord (which extends from the belly toward the placenta) and NOT a limb bud.
- If you cannot clearly identify a nub separate from the cord and legs, respond UNCLEAR.

Step 4: DESCRIBE THE NUB ORIENTATION
- Do NOT attempt to measure a specific angle in degrees. Instead, describe what you see:
  - BOY pattern: The nub points noticeably UPWARD, away from the body. It sticks up at a clear angle relative to the spine. It looks like a small "thumb pointing up."
  - GIRL pattern: The nub lies FLAT, roughly parallel to the lower spine or angled slightly downward. It hugs the body closely. It looks like a small horizontal line near the rump.

Step 5: MAKE YOUR PREDICTION
- Nub clearly sticking up/pointing upward → BOY
- Nub lying flat/parallel/pointing slightly down → GIRL
- Cannot clearly see or distinguish the nub → UNCLEAR

COMMON PITFALLS:
- The umbilical cord can look like an upward-pointing nub — trace it to confirm it goes to the placenta, not between the legs.
- If the baby is not in a true side profile, the nub orientation can be misleading — say UNCLEAR if the angle is off.
- Low image quality or zoom level makes it hard to see — when in doubt, say UNCLEAR.

RESPONSE FORMAT (exactly 3 lines):
Line 1: BOY, GIRL, UNCLEAR, or INVALID
Line 2: Confidence score 0-100
Line 3: Brief explanation of what you observed (1-2 sentences describing the nub's orientation)

Example BOY response:
BOY
82
The nub is clearly visible sticking upward away from the rump area, distinctly angled above the line of the lower spine.

Example GIRL response:
GIRL
78
The nub is visible lying flat and parallel to the lower spine, staying close to the body without any upward projection.`;

  const base64Image = imageBuffer.toString('base64');

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
  ]);

  const text = result.response.text();
  const lines = text.trim().split('\n').filter(l => l.trim());
  const aiPrediction = lines[0]?.toUpperCase() || 'UNCLEAR';
  const aiConfidence = parseFloat(lines[1]) || 0;
  const aiExplanation = lines.slice(2).join(' ') || 'No explanation';

  ok(`AI Prediction: ${aiPrediction}`);
  ok(`AI Confidence: ${aiConfidence}%`);
  ok(`AI Explanation: ${aiExplanation}`);

  // ── STEP 5: Update DB with AI results ──────────────────────
  log(5, 'Updating prediction record with AI results...');

  await sql`
    UPDATE predictions SET
      ai_prediction = ${aiPrediction.toLowerCase()},
      ai_confidence = ${aiConfidence},
      ai_raw_response = ${text}
    WHERE id = ${prediction.id}
  `;

  ok('DB updated with AI prediction');

  // ── STEP 6: Send Telegram photo with review buttons ────────
  log(6, 'Sending Telegram photo with inline keyboard buttons...');

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const caption = [
    `🔍 New scan to review (E2E TEST)`,
    ``,
    `AI says: ${aiPrediction} (${Math.round(aiConfidence)}%)`,
    `Email: ${testEmail}`,
    `ID: ${prediction.id}`,
  ].join('\n');

  const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: signedUrl,
      caption,
      reply_markup: {
        inline_keyboard: [[
          { text: '👦 Boy', callback_data: `boy:${prediction.id}` },
          { text: '👧 Girl', callback_data: `girl:${prediction.id}` },
          { text: '❓ Unclear', callback_data: `unclear:${prediction.id}` },
        ]],
      },
    }),
  });

  const telegramData = await telegramRes.json();

  if (telegramData.ok) {
    ok(`Telegram photo sent! Message ID: ${telegramData.result.message_id}`);
    ok('Check your Telegram — you should see the ultrasound with Boy/Girl/Unclear buttons');
  } else {
    fail(`Telegram send failed: ${JSON.stringify(telegramData)}`);
  }

  // ── STEP 7: Verify DB state ────────────────────────────────
  log(7, 'Verifying final DB state...');

  const verifyRows = await sql`
    SELECT id, customer_email, ai_prediction, ai_confidence, final_result, status
    FROM predictions WHERE id = ${prediction.id}
  `;
  const final = verifyRows[0];

  ok(`ID:            ${final.id}`);
  ok(`Email:         ${final.customer_email}`);
  ok(`AI Prediction: ${final.ai_prediction}`);
  ok(`AI Confidence: ${final.ai_confidence}`);
  ok(`Final Result:  ${final.final_result || '(pending review)'}`);
  ok(`Status:        ${final.status}`);

  // ── Summary ────────────────────────────────────────────────
  console.log('\n' + '='.repeat(60));
  console.log('  E2E TEST COMPLETE');
  console.log('='.repeat(60));
  console.log(`
  Image uploaded to R2:     YES
  DB record created:        YES
  Gemini AI analysis:       ${aiPrediction} (${aiConfidence}%)
  Telegram photo+buttons:   ${telegramData.ok ? 'SENT' : 'FAILED'}

  Next: Tap a button on Telegram to test the webhook callback.
  Then run: node e2e-verify.mjs ${prediction.id}
`);
}

main().catch(err => {
  console.error('\nE2E TEST FAILED:', err);
  process.exit(1);
});
