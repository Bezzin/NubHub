import { NextRequest, NextResponse } from 'next/server';
import { getPredictionById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prediction = await getPredictionById(id);

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      );
    }

    // This endpoint is unauthenticated and addressable by prediction id (the
    // customer's result page polls it). Return ONLY the non-sensitive fields
    // that page consumes — never the full row, which contains PII
    // (customer_email, Stripe ids, scan_image_url, etc.).
    const { final_result, ai_confidence, ai_raw_response } = prediction;
    return NextResponse.json({
      prediction: { final_result, ai_confidence, ai_raw_response },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch prediction' },
      { status: 500 }
    );
  }
}
