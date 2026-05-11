const fs = require('fs');
const path = require('path');

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

function checkEnvironment() {
  log('\n🔍 Checking Environment Setup...', 'blue');
  
  // Check if .env file exists
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    log('✅ .env file found', 'green');
    
    // Read and check key variables
    const envContent = fs.readFileSync(envPath, 'utf8');
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
      if (envContent.includes(`${varName}=`)) {
        const value = envContent.split(`${varName}=`)[1].split('\n')[0];
        const displayValue = varName.includes('PASS') || varName.includes('SECRET') ? '***' : value;
        log(`   ✅ ${varName}: ${displayValue}`, 'green');
      } else {
        log(`   ❌ ${varName}: Missing`, 'red');
        allPresent = false;
      }
    });
    
    return allPresent;
  } else {
    log('❌ .env file not found', 'red');
    log('   Create .env file with your database and email settings', 'yellow');
    return false;
  }
}

function checkDatabaseSetup() {
  log('\n🗄️ Database Setup Instructions:', 'blue');
  log('1. Make sure PostgreSQL is installed and running', 'yellow');
  log('2. Create database: createdb appex_affiliate_portal', 'yellow');
  log('3. Test connection: psql -h localhost -p 5432 -U postgres -d appex_affiliate_portal', 'yellow');
  log('4. Run setup script: psql -h localhost -p 5432 -U postgres -d appex_affiliate_portal -f scripts/database-setup.sql', 'yellow');
  
  return true;
}

function checkEmailSetup() {
  log('\n📧 Email Setup Instructions:', 'blue');
  log('1. Gmail Settings:', 'yellow');
  log('   - Enable 2-Step Verification', 'yellow');
  log('   - Generate App Password (not regular password)', 'yellow');
  log('   - Use smtp.gmail.com:587 with STARTTLS', 'yellow');
  log('2. Test with simple script:', 'yellow');
  log('   - Run: node scripts/email-test.js', 'yellow');
  log('3. Check firewall/antivirus blocking', 'yellow');
  
  return true;
}

function createQuickTestScript() {
  log('\n🔧 Creating quick test script...', 'blue');
  
  const testScript = `
// Quick Database Test
const { execSync } = require('child_process');

try {
  // Test PostgreSQL connection
  console.log('🔍 Testing PostgreSQL...');
  const result = execSync('psql -h localhost -p 5432 -U postgres -d appex_affiliate_portal -c "SELECT NOW();" 2>&1', { encoding: 'utf8' });
  
  if (result.includes('ERROR')) {
    console.log('❌ Database connection failed');
    console.log('Error:', result);
  } else {
    console.log('✅ Database connection successful');
    console.log('Server time:', result.trim());
  }
} catch (error) {
  console.log('❌ Database test failed:', error.message);
  console.log('');
  console.log('Troubleshooting:');
  console.log('1. Is PostgreSQL running? pg_ctl status');
  console.log('2. Does database exist? createdb appex_affiliate_portal');
  console.log('3. Are credentials correct?');
  console.log('4. Is port 5432 available?');
}
  `;
  
  const testPath = path.join(__dirname, 'quick-db-test.js');
  fs.writeFileSync(testPath, testScript);
  log(`✅ Created: ${testPath}`, 'green');
  
  return testPath;
}

function main() {
  log('🚀 AppEx Affiliation Portal - Quick Setup Test', 'blue');
  log('='.repeat(50), 'blue');
  
  // Check environment
  const envOk = checkEnvironment();
  
  if (!envOk) {
    log('\n❌ Environment setup incomplete', 'red');
    log('Please fix .env file first', 'yellow');
    process.exit(1);
  }
  
  // Show database setup instructions
  checkDatabaseSetup();
  
  // Show email setup instructions
  checkEmailSetup();
  
  // Create quick test script
  const testScript = createQuickTestScript();
  
  log('\n' + '='.repeat(50), 'blue');
  log('📋 Next Steps:', 'blue');
  log('1. Test database connection:', 'yellow');
  log(`   node ${testScript}`, 'yellow');
  log('2. Install API dependencies:', 'yellow');
  log('   cd api && npm install', 'yellow');
  log('3. Test email system:', 'yellow');
  log('   node scripts/email-test.js', 'yellow');
  log('4. Start development servers:', 'yellow');
  log('   Backend: cd api && npm run dev', 'yellow');
  
  log('\n🎉 Setup guide complete!', 'green');
}

main().catch(error => {log(`\n💥 Error: ${error.message}`, 'red');
  process.exit(1);
});
