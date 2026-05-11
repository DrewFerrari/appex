const fs = require('fs');
const path = require('path');

// Read environment variables
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

function getEnvVar(name) {
  const match = envContent.match(new RegExp(`${name}=(.+)`, 'm'));
  return match ? match[1].trim() : null;
}

// Test colors
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testEmailConfig() {
  log('\n🧪 Testing Email Configuration...', 'blue');
  
  const emailHost = getEnvVar('EMAIL_HOST');
  const emailPort = getEnvVar('EMAIL_PORT');
  const emailUser = getEnvVar('EMAIL_USER');
  const emailPass = getEnvVar('EMAIL_PASS');
  
  if (!emailHost || !emailPort || !emailUser || !emailPass) {
    log('❌ Email configuration incomplete', 'red');
    log('Missing variables:', 'yellow');
    if (!emailHost) log('   - EMAIL_HOST', 'yellow');
    if (!emailPort) log('   - EMAIL_PORT', 'yellow');
    if (!emailUser) log('   - EMAIL_USER', 'yellow');
    if (!emailPass) log('   - EMAIL_PASS', 'yellow');
    return false;
  }
  
  log('✅ Email configuration found:', 'green');
  log(`   Host: ${emailHost}:${emailPort}`, 'green');
  log(`   User: ${emailUser}`, 'green');
  log(`   Password: ${emailPass ? '***' : 'MISSING'}`, 'green');
  
  return {
    host: emailHost,
    port: emailPort,
    user: emailUser,
    pass: emailPass
  };
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function createTestEmail(config, code) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Test - AppEx Affiliation Portal</title>
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
      <h1>🚀 AppEx Affiliation Portal</h1>
      <p>Email System Test</p>
    </div>
    
    <div class="content">
      <h2>Configuration Test Successful!</h2>
      <p>This is a test email to verify your email configuration is working correctly.</p>
      
      <div class="verification-box">
        <h3>🔐 Test Verification Code</h3>
        <div class="code">${code}</div>
        <p><strong>This code would expire in 15 minutes in production</strong></p>
      </div>
      
      <p><strong>Email Configuration Details:</strong></p>
      <ul>
        <li>SMTP Server: ${config.host}</li>
        <li>Port: ${config.port}</li>
        <li>From: ${config.user}</li>
        <li>Sent: ${new Date().toLocaleString()}</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>© 2024 AppEx Affiliation Portal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  return {
    from: `"AppEx Test" <${config.user}>`,
    to: config.user, // Send to self for testing
    subject: '🧪 Email Configuration Test - AppEx Affiliation Portal',
    html: html
  };
}

function main() {
  log('🚀 AppEx Affiliation Portal - Basic Email Test', 'blue');
  log('='.repeat(50), 'blue');
  
  // Test configuration
  const config = testEmailConfig();
  if (!config) {
    log('\n❌ Please fix email configuration in .env file', 'red');
    process.exit(1);
  }
  
  // Generate test data
  const verificationCode = generateVerificationCode();
  const emailData = createTestEmail(config, verificationCode);
  
  log('\n📧 Test Email Details:', 'blue');
  log(`   From: ${emailData.from}`, 'green');
  log(`   To: ${emailData.to}`, 'green');
  log(`   Subject: ${emailData.subject}`, 'green');
  log(`   Verification Code: ${verificationCode}`, 'green');
  
  log('\n📋 Manual Testing Instructions:', 'yellow');
  log('1. Use an email client to test SMTP settings:', 'yellow');
  log(`   Server: ${config.host}:${config.port}`, 'yellow');
  log(`   Username: ${config.user}`, 'yellow');
  log(`   Password: ${config.pass}`, 'yellow');
  log('   Authentication: STARTTLS', 'yellow');
  log('\n2. Or use online SMTP testers:', 'yellow');
  log('   - https://www.smtp-server.com/smtp-test.aspx', 'yellow');
  log('   - https://www.smtper.com/smtp-test', 'yellow');
  
  log('\n📧 Gmail App Password Setup:', 'yellow');
  log('1. Go to: https://myaccount.google.com/', 'yellow');
  log('2. Security → 2-Step Verification', 'yellow');
  log('3. App passwords → Generate new', 'yellow');
  log('4. Select "Mail" app', 'yellow');
  log('5. Use generated password (not your Gmail password)', 'yellow');
  
  log('\n🎉 Email configuration is ready!', 'green');
  log('Once you verify SMTP works, the application can send:', 'green');
  log('   - Email verification codes', 'green');
  log('   - Password reset links', 'green');
  log('   - Commission notifications', 'green');
  log('   - KYC approval notifications', 'green');
}

main().catch(error => {
  log(`\n💥 Error: ${error.message}`, 'red');
  process.exit(1);
});
