import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email, result, confidence, prediction_id } = await request.json();

    const subject = 'Your Baby Gender Prediction Results 👶';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4A90E2 0%, #FFC0CB 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; border-radius: 0 0 10px 10px; }
            .result-box { background: ${result === 'BOY' ? '#e3f2fd' : '#fce4ec'}; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; border: 2px solid ${result === 'BOY' ? '#4A90E2' : '#FFC0CB'}; }
            .result { font-size: 36px; font-weight: bold; color: ${result === 'BOY' ? '#4A90E2' : '#FFC0CB'}; margin: 10px 0; }
            .confidence { font-size: 24px; color: #666; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; margin-top: 20px; }
            .button { display: inline-block; padding: 12px 30px; background: #4A90E2; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .disclaimer { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Your Results Are Ready!</h1>
            </div>
            <div class="content">
              <p>Hi there!</p>
              <p>We've analyzed your 12-week ultrasound scan.</p>

              <div class="result-box">
                <p style="margin: 0; font-size: 18px;">Our prediction:</p>
                <div class="result">${result === 'BOY' ? 'It\'s a BOY! 💙' : 'It\'s a GIRL! 💗'}</div>
                <div class="confidence">Confidence: ${confidence}%</div>
              </div>

              <p>This prediction is based on nub theory analysis by our AI system and verified by an certified sonographer.</p>

              <div class="disclaimer">
                <strong>⚠️ Important Information:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>This is for entertainment purposes only</li>
                  <li>Your 20-week anatomy scan will confirm the gender</li>
                  <li>If our prediction is wrong, we'll issue a full refund</li>
                </ul>
              </div>

              <h3>What's Next?</h3>
              <ul>
                <li>Wait for your 20-week anatomy scan for official confirmation</li>
                <li>If we got it wrong, upload your 20-week scan for a full refund</li>
                <li>Share your excitement (or surprise!) with loved ones</li>
              </ul>

              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/refund/${prediction_id}" class="button">
                  Request Refund (if incorrect)
                </a>
              </p>

              <p>Questions? Just reply to this email.</p>

              <p>Best wishes,<br>
              <strong>The Nub Prediction Team</strong></p>
            </div>

            <div class="footer">
              <p><strong>Disclaimer:</strong> For entertainment purposes only. Not medical advice.</p>
              <p>© 2025 Nub Theory Gender Prediction. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Hi there!

We've analyzed your 12-week ultrasound scan.

Our prediction: ${result}
Confidence: ${confidence}%

This prediction is based on nub theory analysis by our AI system and verified by a certified sonographer.

What's next?
- Remember, this is for entertainment only (not medical advice)
- Your 20-week anatomy scan will confirm the gender
- If our prediction is wrong, upload your 20-week confirmation scan for a full refund: ${process.env.NEXT_PUBLIC_APP_URL}/refund/${prediction_id}

Questions? Just reply to this email.

Best wishes,
The Nub Prediction Team

---
For entertainment purposes only. Not medical advice.`;

    const { error: sendError } = await resend.emails.send({
      from: 'NubHub <results@nubhub.baby>',
      to: email,
      subject,
      html,
      text,
    });

    if (sendError) {
      return NextResponse.json(
        { error: sendError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
