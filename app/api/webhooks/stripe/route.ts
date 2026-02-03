import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {
  updatePredictionWebhookConfirmed,
  updatePredictionPaymentFailed,
  updatePredictionRefunded,
} from '@/lib/db'
import { sendTelegramNotification } from '@/lib/telegram'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSucceeded(paymentIntent)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await handleChargeRefunded(charge)
        break
      }

      default:
        console.error(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  await updatePredictionWebhookConfirmed('stripe_session_id', session.id)
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  await updatePredictionWebhookConfirmed('stripe_payment_intent_id', paymentIntent.id)
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const customerEmail = paymentIntent.receipt_email || ''

  await sendTelegramNotification(
    `⚠️ <b>Payment Failed</b>\n\n` +
    `Payment Intent: ${paymentIntent.id}\n` +
    `${customerEmail ? `Email: ${customerEmail}\n` : ''}` +
    `Amount: £${(paymentIntent.amount / 100).toFixed(2)}\n` +
    `Failure: ${paymentIntent.last_payment_error?.message || 'Unknown'}`
  )

  await updatePredictionPaymentFailed(paymentIntent.id)
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId = typeof charge.payment_intent === 'string'
    ? charge.payment_intent
    : charge.payment_intent?.id

  if (!paymentIntentId) {
    console.error('No payment_intent on refunded charge:', charge.id)
    return
  }

  await updatePredictionRefunded(paymentIntentId)

  await sendTelegramNotification(
    `💷 <b>Refund Processed</b>\n\n` +
    `Payment Intent: ${paymentIntentId}\n` +
    `Amount Refunded: £${(charge.amount_refunded / 100).toFixed(2)}`
  )
}
