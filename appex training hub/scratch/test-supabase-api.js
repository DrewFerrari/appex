const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kbtwzxypoicbqvnejscp.supabase.co';
const supabaseKey = 'sb_publishable_NMk-ryDfGjMe6iKyBI23BQ_249yqq_e';

console.log('Testing Supabase API connection...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    const { data, error } = await supabase.from('todos').select('*').limit(1);
    
    if (error) {
      console.error('API connection failed:', error.message);
      process.exit(1);
    } else {
      console.log('API connection successful!');
      console.log('Data:', data);
      process.exit(0);
    }
  } catch (err) {
    console.error('Execution error:', err.message);
    process.exit(1);
  }
}

test();
