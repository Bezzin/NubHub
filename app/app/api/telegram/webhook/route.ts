import { NextRequest, NextResponse } from 'next/server'
import {
  getPredictionById,
  updatePredictionUnclear,
  updatePredictionConfirmResult,
} from '@/lib/db'
import {
  answerCallbackQuery,
  editTelegramMessageCaption,
} from '@/lib/telegram'

type CallbackQuery = {
  id: string
  data: string
  message?: {
    message_id: number
    chat: { id: number }
    caption?: string
  }
}

type TelegramUpdate = {
  callback_query?: CallbackQuery
}

const RESULT_LABELS: Record<string, string> = {
  boy: '👦 Boy',
  girl: '👧 Girl',
  unclear: '❓ Unclear',
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret — fail closed if not configured
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('TELEGRAM_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }
    const headerSecret = request.headers.get('x-telegram-bot-api-secret-token')
    if (headerSecret !== webhookSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const update: TelegramUpdate = await request.json()

    // Only handle callback queries (button presses)
    if (!update.callback_query) {
      return NextResponse.json({ ok: true })
    }

    const { id: callbackId, data, message } = update.callback_query

    // Parse callback data: "boy:prediction-id", "girl:prediction-id", "unclear:prediction-id"
    const colonIndex = data.indexOf(':')
    if (colonIndex === -1) {
      await answerCallbackQuery(callbackId, 'Invalid button data')
      return NextResponse.json({ ok: true })
    }

    const result = data.slice(0, colonIndex)
    const predictionId = data.slice(colonIndex + 1)

    if (!['boy', 'girl', 'unclear'].includes(result)) {
      await answerCallbackQuery(callbackId, 'Unknown result type')
      return NextResponse.json({ ok: true })
    }

    // Get the prediction
    const prediction = await getPredictionById(predictionId)
    if (!prediction) {
      await answerCallbackQuery(callbackId, 'Prediction not found')
      return NextResponse.json({ ok: true })
    }

    // Check if already reviewed
    if (prediction.final_result || prediction.manual_review_result) {
      await answerCallbackQuery(callbackId, 'Already reviewed!')
      return NextResponse.json({ ok: true })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    if (result === 'unclear') {
      // Process refund
      const refundRes = await fetch(`${appUrl}/api/refund/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prediction_id: predictionId,
          reason: 'unclear_image',
        }),
      })
      if (!refundRes.ok) {
        console.error('Refund failed:', await refundRes.text())
      }

      // Update DB
      await updatePredictionUnclear(predictionId)

      // Send unclear email
      const emailRes = await fetch(`${appUrl}/api/email/send-unclear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: prediction.customer_email,
        }),
      })
      if (!emailRes.ok) {
        console.error('Unclear email failed:', await emailRes.text())
      }
    } else {
      const confidence = prediction.ai_confidence || 75

      // Update DB first so the customer's polling page can pick up the result
      await updatePredictionConfirmResult(predictionId, {
        manual_review_result: result,
        final_result: result,
        status: 'sent',
        reviewed_at: new Date().toISOString(),
        result_sent_at: new Date().toISOString(),
      })

      // Send result email (boy or girl)
      const emailRes = await fetch(`${appUrl}/api/email/send-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: prediction.customer_email,
          result: result.toUpperCase(),
          confidence,
          prediction_id: predictionId,
        }),
      })
      if (!emailRes.ok) {
        console.error('Result email failed:', await emailRes.text())
      }
    }

    // Acknowledge the button press
    const label = RESULT_LABELS[result] || result
    await answerCallbackQuery(callbackId, `Confirmed: ${label}`)

    // Edit the original Telegram message to show it's been reviewed
    if (message) {
      const originalCaption = message.caption || ''
      const updatedCaption = `${originalCaption}\n\n✅ Reviewed: ${label}`
      await editTelegramMessageCaption(
        message.chat.id,
        message.message_id,
        updatedCaption
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    // Always return 200 to Telegram to prevent retries
    return NextResponse.json({ ok: true })
  }
}
