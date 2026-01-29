const brevo = require('@getbrevo/brevo');

// Initialize Brevo API client
let apiInstance = new brevo.TransactionalEmailsApi();

// Set API key
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

console.log('🔑 Brevo API Key:', process.env.BREVO_API_KEY ? 'Set ✅' : 'NOT SET ❌');

// ✅ Send verification email
exports.sendVerificationEmail = async (email, verificationCode) => {
  try {
    console.log('📧 Sending verification email to:', email);
    
    let sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = '✉️ Verify Your Email - CarHub';
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.sender = { name: 'CarHub', email: 'noreply@carhub.app' };
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              background: #f5f5f5; 
              margin: 0; 
              padding: 20px; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #f9fafb; 
              border-radius: 8px; 
              padding: 40px; 
              border: 1px solid #e5e7eb; 
            }
            .logo { 
              font-size: 32px; 
              font-weight: bold; 
              color: #10b981; 
              text-align: center; 
              margin-bottom: 10px; 
            }
            h1 { 
              color: #1f2937; 
              font-size: 24px; 
              margin-bottom: 10px; 
              text-align: center; 
            }
            .content { 
              background: white; 
              padding: 30px; 
              border-radius: 6px; 
              margin: 20px 0; 
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
            .warning { 
              background: #fef3c7; 
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🚗 CarHub</div>
            <h1>Email Verification Required</h1>
            
            <div class="content">
              <p>Hi there,</p>
              <p>Thank you for signing up on <strong>CarHub</strong>! Please verify your email address using the code below:</p>
              
              <div class="code-box">${verificationCode}</div>
              
              <div class="warning">
                <strong>⏰ Code expires in 15 minutes</strong><br>
                This code will expire in 15 minutes for security reasons.
              </div>
              
              <p style="margin-top: 20px;">
                <strong>Important:</strong> Never share this code with anyone.
              </p>
              
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
            
            <div class="footer">
              <p>© 2024 CarHub. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Verification email sent to:', email);
    console.log('📬 Brevo Response:', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('❌ Brevo error:', error.response ? error.response.body : error);
    throw new Error('Failed to send verification email');
  }
};

// ✅ Send password reset email
exports.sendPasswordResetEmail = async (email, resetCode) => {
  try {
    console.log('📧 Sending password reset email to:', email);
    
    let sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = '🔐 Reset Your Password - CarHub';
    sendSmtpEmail.to = [{ email: email }];
    sendSmtpEmail.sender = { name: 'CarHub', email: 'noreply@carhub.app' };
    sendSmtpEmail.htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              background: #f5f5f5; 
              margin: 0; 
              padding: 20px; 
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background: #f9fafb; 
              border-radius: 8px; 
              padding: 40px; 
              border: 1px solid #e5e7eb; 
            }
            .logo { 
              font-size: 32px; 
              font-weight: bold; 
              color: #10b981; 
              text-align: center; 
              margin-bottom: 10px; 
            }
            h1 { 
              color: #1f2937; 
              font-size: 24px; 
              margin-bottom: 10px; 
              text-align: center; 
            }
            .content { 
              background: white; 
              padding: 30px; 
              border-radius: 6px; 
              margin: 20px 0; 
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
            .warning { 
              background: #fef3c7; 
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
            ul { 
              margin-left: 20px; 
              color: #4b5563; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">🚗 CarHub</div>
            <h1>Reset Your Password</h1>
            
            <div class="content">
              <p>Hi there,</p>
              <p>We received a request to reset your password. Use the code below to create a new password:</p>
              
              <div class="code-box">${resetCode}</div>
              
              <div class="warning">
                <strong>⚠️ Security Alert:</strong> If you didn't request this, please ignore this email.
              </div>
              
              <p style="margin-top: 20px;"><strong>Security Tips:</strong></p>
              <ul>
                <li>Never share this code with anyone</li>
                <li>This code expires in 15 minutes</li>
                <li>Make sure your new password is strong</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>© 2024 CarHub. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Password reset email sent to:', email);
    console.log('📬 Brevo Response:', JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('❌ Brevo error:', error.response ? error.response.body : error);
    throw new Error('Failed to send password reset email');
  }
};

// ✅ Test email connection
exports.testEmailConnection = async () => {
  if (!process.env.BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY is not set');
    throw new Error('Email service is not configured properly');
  }
  console.log('✅ Brevo API is configured and ready');
  return true;
};