function getTelegramConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return null;
  }

  return { botToken, chatId };
}

export async function sendTelegramNotification(message: string) {
  const config = getTelegramConfig();

  if (!config) {
    console.warn('Telegram credentials not configured');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

export async function sendTelegramPhotoWithButtons(params: {
  photoUrl: string;
  predictionId: string;
  aiPrediction: string;
  aiConfidence: number;
  customerEmail: string;
}) {
  const config = getTelegramConfig();

  if (!config) {
    console.warn('Telegram credentials not configured');
    return;
  }

  const caption = [
    `🔍 New scan to review`,
    ``,
    `AI says: ${params.aiPrediction.toUpperCase()} (${Math.round(params.aiConfidence)}%)`,
    `Email: ${params.customerEmail}`,
    `ID: ${params.predictionId}`,
  ].join('\n');

  try {
    const url = `https://api.telegram.org/bot${config.botToken}/sendPhoto`;

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        photo: params.photoUrl,
        caption,
        reply_markup: {
          inline_keyboard: [[
            { text: '👦 Boy', callback_data: `boy:${params.predictionId}` },
            { text: '👧 Girl', callback_data: `girl:${params.predictionId}` },
            { text: '❓ Unclear', callback_data: `unclear:${params.predictionId}` },
          ]],
        },
      }),
    });
  } catch (error) {
    console.error('Failed to send Telegram photo with buttons:', error);
  }
}

export async function answerCallbackQuery(callbackQueryId: string, text: string) {
  const config = getTelegramConfig();
  if (!config) return;

  try {
    await fetch(`https://api.telegram.org/bot${config.botToken}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
      }),
    });
  } catch (error) {
    console.error('Failed to answer callback query:', error);
  }
}

export async function editTelegramMessageCaption(
  chatId: number | string,
  messageId: number,
  newCaption: string
) {
  const config = getTelegramConfig();
  if (!config) return;

  try {
    await fetch(`https://api.telegram.org/bot${config.botToken}/editMessageCaption`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        caption: newCaption,
        reply_markup: { inline_keyboard: [] },
      }),
    });
  } catch (error) {
    console.error('Failed to edit Telegram message caption:', error);
  }
}
