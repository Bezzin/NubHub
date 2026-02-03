import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const subject = 'Refund Issued - Image Quality Issue';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f5f5f5; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e5e5; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .info-box { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4A90E2; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>We Couldn't Analyze Your Scan</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>

              <p>We've reviewed your ultrasound scan, but unfortunately the nub isn't clearly visible in the image you uploaded. This can happen when:</p>

              <ul>
                <li>The baby is positioned at the wrong angle</li>
                <li>The image quality is too low</li>
                <li>The scan was taken too early (before 12 weeks)</li>
              </ul>

              <div class="info-box">
                <strong>✅ Refund Processed</strong>
                <p style="margin: 10px 0 0 0;">We've issued a full refund to your payment method. You should see it in your account in 5-7 business days.</p>
              </div>

              <p>You're welcome to try again if you get another scan with a clearer side view of the baby. We'd love to help you find out!</p>

              <p>If you have any questions, just reply to this email.</p>

              <p>Thanks for trying us out!</p>

              <p>Best wishes,<br>
              <strong>The Nub Prediction Team</strong></p>
            </div>

            <div class="footer">
              <p>© 2025 Nub Theory Gender Prediction. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Hi there,

We've reviewed your ultrasound scan, but unfortunately the nub isn't clearly visible in the image you uploaded. This happens when:
- The baby is positioned at the wrong angle
- The image quality is too low
- The scan was taken too early (before 12 weeks)

REFUND PROCESSED
We've issued a full refund to your payment method. You should see it in your account in 5-7 business days.

You're welcome to try again if you get another scan with a clearer side view of the baby.

Thanks for trying us out!

The Nub Prediction Team`;

    console.log('Sending unclear email via Resend MCP:', { to: email, subject, text, html });

    // TODO: Implement actual Resend MCP call here
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
