const bcrypt = require('bcryptjs');
console.log('bcrypt keys:', Object.keys(bcrypt));
console.log('bcrypt.hash type:', typeof bcrypt.hash);
console.log('bcrypt.compare type:', typeof bcrypt.compare);
