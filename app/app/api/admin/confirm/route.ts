import { NextRequest, NextResponse } from 'next/server'
import { getPredictionById, updatePredictionUnclear, updatePredictionConfirmResult } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { prediction_id, result } = await request.json()

    if (!prediction_id || !result) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the prediction
    const prediction = await getPredictionById(prediction_id)

    if (!prediction) {
      return NextResponse.json(
        { error: 'Prediction not found' },
        { status: 404 }
      )
    }

    if (result === 'unclear') {
      // Process refund and send unclear email
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/refund/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prediction_id,
          reason: 'unclear_image',
        }),
      })

      // Update status
      await updatePredictionUnclear(prediction_id)

      // Send unclear email via Resend MCP
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send-unclear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: prediction.customer_email,
        }),
      })
    } else {
      // Send result email (boy or girl)
      const confidence = prediction.ai_confidence || 75

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send-result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: prediction.customer_email,
          result: result.toUpperCase(),
          confidence,
          prediction_id,
        }),
      })

      // Update status
      await updatePredictionConfirmResult(prediction_id, {
        manual_review_result: result,
        final_result: result,
        status: 'sent',
        reviewed_at: new Date().toISOString(),
        result_sent_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Confirm error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
