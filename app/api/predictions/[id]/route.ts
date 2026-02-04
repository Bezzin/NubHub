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

    return NextResponse.json({ prediction });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch prediction' },
      { status: 500 }
    );
  }
}
