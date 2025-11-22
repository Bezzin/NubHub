import { Resend } from 'resend';

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
};

const FROM_EMAIL = 'NubHub <noreply@nubhub.baby>';
const FROM_NAME = 'NubHub Gender Prediction';

interface PredictionResult {
  gender: 'Boy' | 'Girl';
  confidence: number;
  reasoning: string;
  tips: string[];
}

/**
 * Send immediate result email (Boy/Girl prediction)
 */
export async function sendImmediateResult(
  email: string,
  result: PredictionResult
): Promise<void> {
  const resend = getResendClient();

  const emoji = result.gender === 'Boy' ? '👶💙' : '👶💗';
  const color = result.gender === 'Boy' ? '#60A5FA' : '#F472B6';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your NubHub Results</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #fef3f9;">
      <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: ${color}; font-size: 32px; margin: 0;">Your Results Are Here! ${emoji}</h1>
          <div style="width: 60px; height: 4px; background: ${color}; margin: 20px auto;"></div>
        </div>

        <div style="background: linear-gradient(135deg, ${color}20 0%, ${color}10 100%); border-radius: 15px; padding: 30px; margin: 30px 0;">
          <h2 style="color: ${color}; font-size: 28px; margin: 0 0 10px 0; text-align: center;">Prediction: ${result.gender}</h2>
          <p style="text-align: center; color: #666; font-size: 16px; margin: 0;">Confidence: ${result.confidence}%</p>
        </div>

        <div style="margin: 30px 0;">
          <h3 style="color: #333; font-size: 20px; margin-bottom: 15px;">Analysis</h3>
          <p style="color: #555; line-height: 1.6; font-size: 16px;">${result.reasoning}</p>
        </div>

        ${result.tips.length > 0 ? `
        <div style="background: #f8f9fa; border-radius: 15px; padding: 25px; margin: 30px 0;">
          <h3 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Helpful Tips</h3>
          <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
            ${result.tips.map(tip => `<li style="margin-bottom: 8px;">${tip}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #f0f0f0; text-align: center;">
          <p style="color: #888; font-size: 14px; margin: 0 0 10px 0;">Thank you for using NubHub!</p>
          <p style="color: #aaa; font-size: 12px; margin: 0;">This prediction is for entertainment purposes. Please consult your healthcare provider for official results.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `🎉 Your NubHub Results: It's a ${result.gender}!`,
    html,
  });
}

/**
 * Send "under review" email (Unclear result)
 */
export async function sendUnderReview(email: string, submissionId: string): Promise<void> {
  const resend = getResendClient();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Expert Review in Progress</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #fef3f9;">
      <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #a855f7; font-size: 32px; margin: 0;">Expert Review in Progress 👨‍⚕️</h1>
          <div style="width: 60px; height: 4px; background: #a855f7; margin: 20px auto;"></div>
        </div>

        <div style="background: linear-gradient(135deg, #a855f720 0%, #a855f710 100%); border-radius: 15px; padding: 30px; margin: 30px 0;">
          <p style="color: #555; line-height: 1.8; font-size: 16px; margin: 0; text-align: center;">
            <strong>Your scan requires expert human review for the most accurate result.</strong>
          </p>
        </div>

        <div style="margin: 30px 0;">
          <h3 style="color: #333; font-size: 20px; margin-bottom: 15px;">What happens next?</h3>
          <ul style="color: #555; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 12px;">Our specialist will carefully analyze your ultrasound image</li>
            <li style="margin-bottom: 12px;">You'll receive your results via email within <strong>2 hours</strong></li>
            <li style="margin-bottom: 12px;">If we don't deliver on time, you'll receive an automatic full refund</li>
          </ul>
        </div>

        <div style="background: #fff9e6; border-left: 4px solid: #fbbf24; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <p style="color: #92400e; font-size: 14px; margin: 0;">
            <strong>⏰ Results guaranteed within 2 hours or your money back!</strong>
          </p>
        </div>

        <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #f0f0f0; text-align: center;">
          <p style="color: #888; font-size: 14px; margin: 0 0 10px 0;">Reference ID: ${submissionId.substring(0, 8)}</p>
          <p style="color: #aaa; font-size: 12px; margin: 0;">Thank you for your patience!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: '⏳ Your scan is being reviewed by our expert',
    html,
  });
}

/**
 * Send manual review result email
 */
export async function sendReviewedResult(
  email: string,
  result: PredictionResult,
  reviewerName: string
): Promise<void> {
  const resend = getResendClient();

  const emoji = result.gender === 'Boy' ? '👶💙' : '👶💗';
  const color = result.gender === 'Boy' ? '#60A5FA' : '#F472B6';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Expert Review Complete</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #fef3f9;">
      <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: ${color}; font-size: 32px; margin: 0;">Expert Review Complete! ${emoji}</h1>
          <div style="width: 60px; height: 4px; background: ${color}; margin: 20px auto;"></div>
        </div>

        <div style="background: linear-gradient(135deg, ${color}20 0%, ${color}10 100%); border-radius: 15px; padding: 30px; margin: 30px 0;">
          <h2 style="color: ${color}; font-size: 28px; margin: 0 0 10px 0; text-align: center;">Prediction: ${result.gender}</h2>
          <p style="text-align: center; color: #666; font-size: 14px; margin: 0;">Reviewed by ${reviewerName}</p>
        </div>

        <div style="margin: 30px 0;">
          <h3 style="color: #333; font-size: 20px; margin-bottom: 15px;">Expert Analysis</h3>
          <p style="color: #555; line-height: 1.6; font-size: 16px;">${result.reasoning}</p>
        </div>

        ${result.tips.length > 0 ? `
        <div style="background: #f8f9fa; border-radius: 15px; padding: 25px; margin: 30px 0;">
          <h3 style="color: #333; font-size: 18px; margin: 0 0 15px 0;">Helpful Tips</h3>
          <ul style="margin: 0; padding-left: 20px; color: #555; line-height: 1.8;">
            ${result.tips.map(tip => `<li style="margin-bottom: 8px;">${tip}</li>`).join('')}
          </ul>
        </div>
        ` : ''}

        <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #f0f0f0; text-align: center;">
          <p style="color: #888; font-size: 14px; margin: 0 0 10px 0;">Thank you for using NubHub!</p>
          <p style="color: #aaa; font-size: 12px; margin: 0;">This prediction is for entertainment purposes. Please consult your healthcare provider for official results.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `✨ Expert Review Complete: It's a ${result.gender}!`,
    html,
  });
}

/**
 * Send refund apology email
 */
export async function sendRefundApology(email: string, submissionId: string): Promise<void> {
  const resend = getResendClient();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Refund Processed</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #fef3f9;">
      <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ef4444; font-size: 28px; margin: 0;">We're Sorry 😔</h1>
          <div style="width: 60px; height: 4px; background: #ef4444; margin: 20px auto;"></div>
        </div>

        <div style="margin: 30px 0;">
          <p style="color: #555; line-height: 1.8; font-size: 16px;">
            We sincerely apologize for not being able to deliver your results within the promised 2-hour timeframe.
          </p>
          <p style="color: #555; line-height: 1.8; font-size: 16px;">
            <strong>A full refund of £9.97 has been processed to your original payment method.</strong> You should see it within 5-10 business days.
          </p>
        </div>

        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <p style="color: #991b1b; font-size: 14px; margin: 0;">
            <strong>Refund Status:</strong> Processed<br>
            <strong>Amount:</strong> £9.97<br>
            <strong>Reference:</strong> ${submissionId.substring(0, 8)}
          </p>
        </div>

        <div style="margin: 30px 0;">
          <p style="color: #555; line-height: 1.8; font-size: 16px;">
            If you'd like to try again, we'd be happy to offer you a <strong>complimentary analysis</strong>. Just reply to this email and we'll send you a special link.
          </p>
        </div>

        <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #f0f0f0; text-align: center;">
          <p style="color: #888; font-size: 14px; margin: 0 0 10px 0;">Thank you for your understanding</p>
          <p style="color: #aaa; font-size: 12px; margin: 0;">The NubHub Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Refund Processed - We Apologize for the Delay',
    html,
  });
}
