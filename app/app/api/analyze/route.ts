import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPredictionById, updatePredictionAI } from '@/lib/db';
import { getSignedImageUrl } from '@/lib/r2';
import { sendTelegramPhotoWithButtons } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const { prediction_id } = await request.json();

    if (!prediction_id) {
      return NextResponse.json(
        { error: 'Missing prediction_id' },
        { status: 400 }
      );
    }

    // Get the prediction record
    const prediction = await getPredictionById(prediction_id);

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      );
    }

    // Generate signed URL from R2 key and fetch the image
    const imageUrl = await getSignedImageUrl(prediction.scan_image_url);
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Prepare Gemini prompt — pattern recognition, no angle measurement
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

    // Call Gemini API — Gemini 3 Flash (latest multimodal model)
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageResponse.headers.get('content-type') || 'image/jpeg',
          data: base64Image,
        },
      },
    ]);

    const response = result.response;
    const text = response.text();

    // Parse the response
    const lines = text.trim().split('\n').filter(line => line.trim());
    const aiPrediction = lines[0]?.toUpperCase() || 'UNCLEAR';
    const aiConfidence = parseFloat(lines[1]) || 0;
    const aiExplanation = lines.slice(2).join(' ') || 'No explanation provided';

    // Update the prediction record
    await updatePredictionAI(prediction_id, {
      ai_prediction: aiPrediction.toLowerCase(),
      ai_confidence: aiConfidence,
      ai_raw_response: text,
    });

    // Send to Telegram for manual review (with image + inline buttons)
    sendTelegramPhotoWithButtons({
      photoUrl: imageUrl,
      predictionId: prediction_id,
      aiPrediction,
      aiConfidence,
      customerEmail: prediction.customer_email,
    }).catch((err) => {
      console.error('Failed to send Telegram review notification:', err);
    });

    return NextResponse.json({
      success: true,
      prediction: aiPrediction,
      confidence: aiConfidence,
      explanation: aiExplanation,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Analyze error:', message);
    return NextResponse.json(
      { error: 'Failed to analyze image', details: message },
      { status: 500 }
    );
  }
}
