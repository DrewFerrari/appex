const { Client } = require('pg');

const connectionString = 'postgresql://postgres.kbtwzxypoicbqvnejscp:andrewmunyanyi@aws-0-eu-west-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString: connectionString,
});

client.connect()
  .then(() => {
    console.log('Connected successfully');
    client.end();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
    process.exit(1);
  });
