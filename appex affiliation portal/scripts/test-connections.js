const { Client } = require('pg');
const nodemailer = require('nodemailer');
const redis = require('redis');
require('dotenv').config();

// Test colors for console output
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

async function testDatabaseConnection() {
  log('\n🔍 Testing PostgreSQL Database Connection...', 'blue');
  
  try {
    const client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'appex_affiliate_portal',
      connectionTimeoutMillis: 5000,
    });

    await client.connect();
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    
    log('✅ Database connection successful!', 'green');
    log(`   Server Time: ${result.rows[0].current_time}`, 'green');
    log(`   PostgreSQL Version: ${result.rows[0].version}`, 'green');
    
    // Test if database exists and has tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      log(`   Found ${tablesResult.rows.length} tables in database`, 'green');
      tablesResult.rows.forEach(row => {
        log(`     - ${row.table_name}`, 'green');
      });
    } else {
      log('   ⚠️  No tables found. Run migrations first.', 'yellow');
    }
    
    await client.end();
    return true;
  } catch (error) {
    log(`❌ Database connection failed: ${error.message}`, 'red');
    log('   Check:', 'yellow');
    log('   - PostgreSQL is running on localhost:5432', 'yellow');
    log('   - Database "appex_affiliate_portal" exists', 'yellow');
    log('   - User "postgres" has correct password', 'yellow');
    return false;
  }
}

async function testRedisConnection() {
  log('\n🔍 Testing Redis Connection...', 'blue');
  
  try {
    const client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      connectTimeout: 5000,
    });

    client.on('error', (err) => {
      log(`❌ Redis error: ${err.message}`, 'red');
    });

    await client.connect();
    
    // Test basic operations
    await client.set('test_key', 'test_value', { EX: 10 });
    const value = await client.get('test_key');
    await client.del('test_key');
    
    if (value === 'test_value') {
      log('✅ Redis connection successful!', 'green');
      log('   Basic SET/GET/DEL operations working', 'green');
    }
    
    await client.quit();
    return true;
  } catch (error) {
    log(`❌ Redis connection failed: ${error.message}`, 'red');
    log('   Check:', 'yellow');
    log('   - Redis is running on localhost:6379', 'yellow');
    log('   - Redis password is correct (if set)', 'yellow');
    return false;
  }
}

async function testEmailConnection() {
  log('\n🔍 Testing Email Configuration...', 'blue');
  
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    await transporter.verify();
    
    log('✅ Email configuration valid!', 'green');
    log(`   SMTP Server: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`, 'green');
    log(`   From Email: ${process.env.EMAIL_USER}`, 'green');
    
    // Test sending a verification email
    const testEmail = {
      from: `"AppEx Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: '🧪 AppEx Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">✅ Email Test Successful!</h2>
          <p>This is a test email from the AppEx Affiliation Portal.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>SMTP Server: ${process.env.EMAIL_HOST}</li>
            <li>Port: ${process.env.EMAIL_PORT}</li>
            <li>From: ${process.env.EMAIL_USER}</li>
            <li>Sent: ${new Date().toLocaleString()}</li>
          </ul>
          <p style="color: #666;">If you received this email, your email configuration is working correctly.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(testEmail);
    log('✅ Test email sent successfully!', 'green');
    log(`   Message ID: ${result.messageId}`, 'green');
    log(`   Check your inbox for test email`, 'yellow');
    
    return true;
  } catch (error) {
    log(`❌ Email configuration failed: ${error.message}`, 'red');
    log('   Check:', 'yellow');
    log('   - Gmail app password is correct (not regular password)', 'yellow');
    log('   - "Less secure app access" is enabled in Gmail', 'yellow');
    log('   - SMTP settings are correct (smtp.gmail.com:587)', 'yellow');
    return false;
  }
}

async function testEnvironmentVariables() {
  log('\n🔍 Checking Environment Variables...', 'blue');
  
  const requiredVars = [
    'DB_HOST',
    'DB_PORT', 
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      log(`   ✅ ${varName}: ${varName.includes('PASS') || varName.includes('SECRET') ? '***' : process.env[varName]}`, 'green');
    } else {
      log(`   ❌ ${varName}: Missing`, 'red');
      allPresent = false;
    }
  });
  
  return allPresent;
}

async function main() {
  log('🚀 AppEx Affiliation Portal - Connection Test Suite', 'blue');
  log('=' .repeat(50), 'blue');
  
  // Test environment variables first
  const envOk = await testEnvironmentVariables();
  
  if (!envOk) {
    log('\n❌ Some environment variables are missing. Please check your .env file.', 'red');
    process.exit(1);
  }
  
  // Test all connections
  const dbOk = await testDatabaseConnection();
  const redisOk = await testRedisConnection();
  const emailOk = await testEmailConnection();
  
  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log('📊 Test Summary:', 'blue');
  
  if (dbOk && redisOk && emailOk) {
    log('🎉 All connections are working correctly!', 'green');
    log('\nYou can now start the application:', 'yellow');
    log('   Backend: cd api && npm run dev', 'yellow');
    log('   Frontend: cd web && npm run dev', 'yellow');
  } else {
    log('❌ Some connections failed. Please fix the issues above.', 'red');
    log('\nTroubleshooting:', 'yellow');
    log('   1. Ensure PostgreSQL is running: pg_ctl status', 'yellow');
    log('   2. Ensure Redis is running: redis-cli ping', 'yellow');
    log('   3. Check Gmail app password settings', 'yellow');
    log('   4. Verify database exists: createdb appex_affiliate_portal', 'yellow');
    process.exit(1);
  }
}

// Run tests
main().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});
