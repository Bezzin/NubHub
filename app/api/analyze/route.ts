import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPredictionById, updatePredictionAI } from '@/lib/db';
import { getSignedImageUrl } from '@/lib/r2';

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

    // Prepare Gemini prompt
    const prompt = `You are analyzing a 12-week pregnancy ultrasound scan image.

Your task:
1. Identify if this is a valid ultrasound scan image
2. Locate the genital tubercle (nub) - a small protrusion between the baby's legs
3. Identify the baby's spine
4. Measure the angle between the nub and the spine

Prediction rules:
- If nub angle > 30 degrees upward from spine: Predict BOY
- If nub angle < 30 degrees or parallel to spine: Predict GIRL
- If nub is not clearly visible: Respond UNCLEAR
- If this is not an ultrasound image: Respond INVALID

Important considerations:
- Image quality matters - if you cannot confidently see the nub, say UNCLEAR
- The nub must be clearly distinguishable from umbilical cord, legs, or fingers
- Look for the characteristic side profile view

Respond ONLY with one word: BOY, GIRL, UNCLEAR, or INVALID

Then on the next line, provide a confidence score from 0-100.

Then on the next line, briefly explain what you see (1-2 sentences).

Example response:
BOY
85
The nub is clearly visible and angled approximately 40 degrees upward from the spine, indicating male development.`;

    // Call Gemini API - Using Gemini 1.5 Pro (stable and reliable)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.0-flash' });

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

    // Auto-send email with results
    if (aiPrediction === 'BOY' || aiPrediction === 'GIRL') {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: prediction.customer_email,
          result: aiPrediction,
          confidence: aiConfidence,
          prediction_id,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      prediction: aiPrediction,
      confidence: aiConfidence,
      explanation: aiExplanation,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
