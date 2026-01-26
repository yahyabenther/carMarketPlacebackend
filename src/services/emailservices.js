const nodemailer = require('nodemailer');
const config = require('../config/env');

// Create transporter
const transporter = nodemailer.createTransport({
 host: 'smtp.gmail.com', // Using the name is fine now that IPv4 is forced
  port: 587,
  secure: false, 
  auth: {
    // Force the use of process.env directly to ensure they aren't missing
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }

});

// ✅ Send verification email with 6-digit code
exports.sendVerificationEmail = async (email, verificationCode) => {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
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
              font-size: 32px;
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
            .content p {
              margin-bottom: 15px;
              color: #4b5563;
              font-size: 15px;
            }
            .code-box {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              font-size: 48px;
              font-weight: bold;
              letter-spacing: 12px;
              padding: 30px;
              border-radius: 8px;
              text-align: center;
              margin: 30px 0;
              font-family: 'Courier New', monospace;
            }
            .info-box {
              background-color: #f0fdf4;
              border-left: 4px solid #10b981;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              font-size: 14px;
              color: #166534;
            }
            .warning {
              background-color: #fef3c7;
              border: 1px solid #fcd34d;
              color: #92400e;
              padding: 15px;
              border-radius: 4px;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 13px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
              margin-top: 30px;
            }
            .footer a {
              color: #10b981;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
            .divider {
              height: 1px;
              background-color: #e5e7eb;
              margin: 20px 0;
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
              
              <p>Thank you for signing up on <strong>CarHub</strong>! To get started, please verify your email address using the code below:</p>

              <div class="code-box">
                ${verificationCode}
              </div>

              <div class="info-box">
                <strong>ℹ️ How to use:</strong><br>
                Enter this 6-digit code on the verification page to confirm your email address.
              </div>

              <div class="warning">
                <strong>⏰ Code expires in 15 minutes:</strong> This code will expire in 15 minutes for security reasons. If it expires, you can request a new one.
              </div>

              <p style="margin-top: 20px;">
                <strong>Important:</strong> Never share this code with anyone. We will never ask for this code via email or message.
              </p>

              <p>
                If you didn't create this account, please ignore this email or contact our support team immediately.
              </p>
            </div>

            <div class="footer">
              <p style="margin-bottom: 10px;">
                © 2024 CarHub. All rights reserved.
              </p>
              <p>
                <a href="${config.FRONTEND_URL}">Visit CarHub</a> | 
                <a href="${config.FRONTEND_URL}/contact">Contact Support</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"CarHub" <${config.SMTP_FROM || config.SMTP_USER}>`,
      to: email,
      subject: '✉️ Verify Your Email - CarHub',
      html: htmlTemplate,
      text: `
        Welcome to CarHub!
        
        Your verification code is: ${verificationCode}
        
        This code will expire in 15 minutes.
        
        If you didn't create this account, please ignore this email.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// ✅ Send password reset email with 6-digit code
exports.sendPasswordResetEmail = async (email, resetCode) => {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
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
              font-size: 32px;
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
            .content p {
              margin-bottom: 15px;
              color: #4b5563;
              font-size: 15px;
            }
            .code-box {
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              color: white;
              font-size: 48px;
              font-weight: bold;
              letter-spacing: 12px;
              padding: 30px;
              border-radius: 8px;
              text-align: center;
              margin: 30px 0;
              font-family: 'Courier New', monospace;
            }
            .info-box {
              background-color: #fef2f2;
              border-left: 4px solid #ef4444;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              font-size: 14px;
              color: #7f1d1d;
            }
            .warning {
              background-color: #fef3c7;
              border: 1px solid #fcd34d;
              color: #92400e;
              padding: 15px;
              border-radius: 4px;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              color: #6b7280;
              font-size: 13px;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
              margin-top: 30px;
            }
            .footer a {
              color: #10b981;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🚗 CarHub</div>
              <h1>Reset Your Password</h1>
            </div>

            <div class="content">
              <p>Hi there,</p>
              
              <p>We received a request to reset your password. Use the code below to create a new password for your CarHub account:</p>

              <div class="code-box">
                ${resetCode}
              </div>

              <div class="info-box">
                <strong>ℹ️ What to do:</strong><br>
                Enter this 6-digit code on the password reset page to create a new password.
              </div>

              <div class="warning">
                <strong>⚠️ Security Alert:</strong> If you didn't request this password reset, please ignore this email and your password will remain unchanged. Your account is still secure.
              </div>

              <p style="margin-top: 20px;">
                <strong>Important Security Tips:</strong>
              </p>
              <ul style="margin-left: 20px; color: #4b5563;">
                <li>Never share this code with anyone</li>
                <li>We will never ask for this code via email or message</li>
                <li>This code expires in 15 minutes</li>
                <li>Make sure your new password is strong and unique</li>
              </ul>

              <p style="margin-top: 20px;">
                If you have any questions or need help, contact our support team.
              </p>
            </div>

            <div class="footer">
              <p style="margin-bottom: 10px;">
                © 2024 CarHub. All rights reserved.
              </p>
              <p>
                <a href="${config.FRONTEND_URL}">Visit CarHub</a> | 
                <a href="${config.FRONTEND_URL}/contact">Contact Support</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: `"CarHub" <${config.SMTP_FROM || config.SMTP_USER}>`,
      to: email,
      subject: '🔐 Reset Your Password - CarHub',
      html: htmlTemplate,
      text: `
        Reset Your Password
        
        Your password reset code is: ${resetCode}
        
        This code will expire in 15 minutes.
        
        If you didn't request this, please ignore this email and your password will remain unchanged.
        
        Never share this code with anyone.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`, info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// ✅ Test email connection
exports.testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error);
    throw new Error('Email service is not configured properly');
  }
};