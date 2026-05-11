
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
  