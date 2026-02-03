import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPredictionById, updatePredictionRefundedById } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { prediction_id, reason } = await request.json()

    if (!prediction_id) {
      return NextResponse.json(
        { error: 'Missing prediction_id' },
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

    // Process refund via Stripe
    if (prediction.stripe_payment_intent_id) {
      await stripe.refunds.create({
        payment_intent: prediction.stripe_payment_intent_id,
        reason: reason === 'unclear_image' ? 'requested_by_customer' : 'requested_by_customer',
      })
    }

    // Update prediction status
    await updatePredictionRefundedById(prediction_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Refund processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}
