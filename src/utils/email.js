const nodemailer = require('nodemailer');

async function sendVerificationEmail(email, token) {
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});


  // ✅ Generate verification URL with token in query params
const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  // ✅ Professional HTML email template
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 40px;
            border: 1px solid #e5e7eb;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #10b981;
            margin-bottom: 10px;
          }
          h1 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 10px;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 6px;
            margin-bottom: 30px;
          }
          .verification-button {
            display: inline-block;
            background-color: #10b981;
            color: white;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 20px;
            margin-bottom: 20px;
          }
          .verification-button:hover {
            background-color: #059669;
          }
          .token-box {
            background-color: #f3f4f6;
            border: 1px solid #d1d5db;
            padding: 15px;
            border-radius: 4px;
            margin-top: 15px;
            font-family: 'Courier New', monospace;
            word-break: break-all;
            font-size: 12px;
            color: #374151;
          }
          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 13px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 30px;
          }
          .warning {
            background-color: #fef3c7;
            border: 1px solid #fcd34d;
            color: #92400e;
            padding: 12px;
            border-radius: 4px;
            font-size: 13px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚗 CarHub</div>
            <h1>Email Verification Required</h1>
          </div>

          <div class="content">
            <p>Hi there,</p>
            
            <p>Thank you for signing up on <strong>CarHub</strong>! To get started, please verify your email address by clicking the button below:</p>

            <center>
              <a href="${verificationUrl}" class="verification-button">
                ✓ Verify Email Address
              </a>
            </center>

            <p style="text-align: center; color: #6b7280; font-size: 13px;">
              Or copy this link in your browser:
            </p>
            
            <div class="token-box">
              ${verificationUrl}
            </div>

            <div class="warning">
              <strong>⏰ Expires in 24 hours:</strong> This link will expire in 24 hours for security reasons. If it expires, you can request a new verification email.
            </div>

            <p style="margin-top: 20px;">
              If you didn't create this account, please ignore this email or contact our support team.
            </p>
          </div>

          <div class="footer">
            <p>
              © 2024 CarHub. All rights reserved.<br>
              <a href="${process.env.FRONTEND_URL}" style="color: #10b981; text-decoration: none;">Visit CarHub</a> | 
              <a href="${process.env.FRONTEND_URL}/contact" style="color: #10b981; text-decoration: none;">Contact Support</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: '✉️ Verify Your Email - CarHub',
      html: htmlTemplate,
      // Fallback plain text
      text: `
        Welcome to CarHub!
        
        Please verify your email by visiting this link:
        ${verificationUrl}
        
        This link expires in 24 hours.
        
        If you didn't create this account, please ignore this email.
      `
    });

    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

module.exports = { sendVerificationEmail };