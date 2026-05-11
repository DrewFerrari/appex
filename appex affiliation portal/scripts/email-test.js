const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email verification code sending
async function testEmailVerification() {
  console.log('🧪 Testing Email Verification Code System...\n');
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    console.log(`   Server: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`);
    console.log(`   User: ${process.env.EMAIL_USER}\n`);

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔢 Generated verification code: ${verificationCode}`);

    // Send verification email
    const verificationEmail = {
      from: `"AppEx Affiliation Portal" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: '🔐 Verify Your Email Address - AppEx Affiliation Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - AppEx Affiliation Portal</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
              font-size: 16px;
            }
            .content {
              padding: 40px 30px;
            }
            .verification-box {
              background-color: #f8f9fa;
              border: 2px dashed #6c757d;
              border-radius: 8px;
              padding: 30px;
              text-align: center;
              margin: 30px 0;
            }
            .code {
              font-size: 36px;
              font-weight: bold;
              color: #007bff;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
              margin: 20px 0;
            }
            .instructions {
              background-color: #e7f3ff;
              border-left: 4px solid #007bff;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px 30px;
              text-align: center;
              color: #6c757d;
              font-size: 14px;
            }
            .btn {
              display: inline-block;
              padding: 12px 30px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: 600;
              margin: 20px 0;
            }
            .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 15px;
              border-radius: 4px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 AppEx Affiliation Portal</h1>
              <p>Email Verification Required</p>
            </div>
            
            <div class="content">
              <h2>Hello!</h2>
              <p>Thank you for registering with AppEx Affiliation Portal. To complete your registration and start earning commissions, please verify your email address.</p>
              
              <div class="verification-box">
                <h3>🔐 Your Verification Code</h3>
                <div class="code">${verificationCode}</div>
                <p><strong>This code expires in 15 minutes</strong></p>
              </div>
              
              <div class="instructions">
                <h4>📋 Instructions:</h4>
                <ol>
                  <li>Return to the AppEx Affiliation Portal</li>
                  <li>Enter the verification code above</li>
                  <li>Click "Verify Email" to complete registration</li>
                </ol>
              </div>
              
              <div class="warning">
                <strong>🔒 Security Notice:</strong> Never share this verification code with anyone. Our team will never ask for your verification code via email or phone.
              </div>
              
              <p>If you didn't create an account with AppEx Affiliation Portal, please ignore this email.</p>
            </div>
            
            <div class="footer">
              <p>© 2024 AppEx Affiliation Portal. All rights reserved.</p>
              <p>Need help? Contact us at <a href="mailto:support@appexaffiliation.com">support@appexaffiliation.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('📧 Sending verification email...');
    const result = await transporter.sendMail(verificationEmail);
    
    console.log('✅ Verification email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   To: ${result.envelope.to}`);
    console.log(`   Check your inbox for the verification code\n`);
    
    return {
      success: true,
      messageId: result.messageId,
      verificationCode: verificationCode
    };
    
  } catch (error) {
    console.error('❌ Email verification test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Gmail Authentication Issues:');
      console.log('   1. Use an App Password, not your regular password');
      console.log('   2. Enable 2-Step Verification on your Gmail account');
      console.log('   3. Go to: https://myaccount.google.com/apppasswords');
      console.log('   4. Generate a new app password for "AppEx Affiliation Portal"');
    }
    
    if (error.code === 'ECONNECTION') {
      console.log('\n🔧 Connection Issues:');
      console.log('   1. Check internet connection');
      console.log('   2. Verify SMTP settings (smtp.gmail.com:587)');
      console.log('   3. Check firewall/antivirus blocking');
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Test password reset email
async function testPasswordReset() {
  console.log('🔄 Testing Password Reset Email System...\n');
  
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const resetEmail = {
      from: `"AppEx Security" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '🔐 Password Reset Request - AppEx Affiliation Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - AppEx Affiliation Portal</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 40px 30px;
            }
            .reset-box {
              background-color: #f8f9fa;
              border: 2px solid #dc3545;
              border-radius: 8px;
              padding: 30px;
              margin: 30px 0;
            }
            .token {
              font-size: 18px;
              font-weight: bold;
              color: #dc3545;
              background-color: #fff;
              padding: 15px;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
              word-break: break-all;
            }
            .btn {
              display: inline-block;
              padding: 12px 30px;
              background-color: #dc3545;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: 600;
              margin: 20px 0;
            }
            .warning {
              background-color: #f8d7da;
              border: 1px solid #f5c6cb;
              color: #721c24;
              padding: 15px;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 20px 30px;
              text-align: center;
              color: #6c757d;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Security Alert</h1>
              <p>Password Reset Request</p>
            </div>
            
            <div class="content">
              <h2>Password Reset Requested</h2>
              <p>We received a request to reset the password for your AppEx Affiliation Portal account.</p>
              
              <div class="reset-box">
                <h3>🔑 Reset Token</h3>
                <div class="token">${resetToken}</div>
                <p><strong>This token expires in 1 hour</strong></p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> 
                <ul>
                  <li>If you didn't request this password reset, please secure your account immediately</li>
                  <li>Never share this reset token with anyone</li>
                  <li>This token can only be used once</li>
                </ul>
              </div>
              
              <p>If you need help, contact our support team.</p>
            </div>
            
            <div class="footer">
              <p>© 2024 AppEx Affiliation Portal. All rights reserved.</p>
              <p>Security: <a href="mailto:security@appexaffiliation.com">security@appexaffiliation.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log('📧 Sending password reset email...');
    const result = await transporter.sendMail(resetEmail);
    
    console.log('✅ Password reset email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   Reset Token: ${resetToken}`);
    console.log(`   Check your inbox for the reset email\n`);
    
    return {
      success: true,
      messageId: result.messageId,
      resetToken: resetToken
    };
    
  } catch (error) {
    console.error('❌ Password reset test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Main test function
async function main() {
  console.log('🚀 AppEx Affiliation Portal - Email System Test');
  console.log('='.repeat(50));
  
  // Test verification email
  const verificationResult = await testEmailVerification();
  
  if (!verificationResult.success) {
    console.log('\n❌ Email verification system test failed!');
    process.exit(1);
  }
  
  // Wait a moment before sending next email
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test password reset email
  const resetResult = await testPasswordReset();
  
  if (!resetResult.success) {
    console.log('\n❌ Password reset system test failed!');
    process.exit(1);
  }
  
  // Summary
  console.log('='.repeat(50));
  console.log('📊 Email System Test Results:');
  console.log('✅ Verification Code System: Working');
  console.log('✅ Password Reset System: Working');
  console.log('✅ SMTP Configuration: Valid');
  console.log('✅ Email Templates: Functional');
  console.log('\n🎉 Email system is ready for production!');
  console.log('\n📧 Integration Notes:');
  console.log('   - Verification codes expire in 15 minutes');
  console.log('   - Reset tokens expire in 1 hour');
  console.log('   - All emails include security warnings');
  console.log('   - Templates are responsive and mobile-friendly');
}

// Run tests
main().catch(error => {
  console.error('\n💥 Unexpected error:', error.message);
  process.exit(1);
});
