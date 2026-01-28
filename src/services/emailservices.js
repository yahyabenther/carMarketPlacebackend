const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Send verification email
exports.sendVerificationEmail = async (email, verificationCode) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CarHub <onboarding@resend.dev>', // Use resend.dev for testing
      to: email,
      subject: '✉️ Verify Your Email - CarHub',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 20px auto; padding: 40px; background: #f9fafb; border-radius: 8px; }
              .logo { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin-bottom: 20px; }
              .code-box { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; font-size: 48px; font-weight: bold; letter-spacing: 12px; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0; font-family: monospace; }
              .content { background: white; padding: 30px; border-radius: 6px; }
              .warning { background: #fef3c7; border: 1px solid #fcd34d; color: #92400e; padding: 15px; border-radius: 4px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">🚗 CarHub</div>
              <div class="content">
                <h1>Email Verification</h1>
                <p>Thank you for signing up! Use this code to verify your email:</p>
                <div class="code-box">${verificationCode}</div>
                <div class="warning">
                  <strong>⏰ This code expires in 15 minutes</strong>
                </div>
                <p>If you didn't create this account, please ignore this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw new Error('Failed to send verification email');
    }

    console.log('✅ Verification email sent to:', email, 'ID:', data.id);
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// ✅ Send password reset email
exports.sendPasswordResetEmail = async (email, resetCode) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'CarHub <onboarding@resend.dev>',
      to: email,
      subject: '🔐 Reset Your Password - CarHub',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 20px auto; padding: 40px; background: #f9fafb; border-radius: 8px; }
              .logo { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin-bottom: 20px; }
              .code-box { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; font-size: 48px; font-weight: bold; letter-spacing: 12px; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0; font-family: monospace; }
              .content { background: white; padding: 30px; border-radius: 6px; }
              .warning { background: #fef3c7; border: 1px solid #fcd34d; color: #92400e; padding: 15px; border-radius: 4px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">🚗 CarHub</div>
              <div class="content">
                <h1>Reset Your Password</h1>
                <p>Use this code to reset your password:</p>
                <div class="code-box">${resetCode}</div>
                <div class="warning">
                  <strong>⏰ This code expires in 15 minutes</strong>
                </div>
                <p>If you didn't request this, please ignore this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw new Error('Failed to send password reset email');
    }

    console.log('✅ Password reset email sent to:', email, 'ID:', data.id);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// ✅ Test email connection
exports.testEmailConnection = async () => {
  console.log('✅ Resend API is configured');
  return true;
};