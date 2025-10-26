// Generate a secure random secret for AUTH0_SECRET
const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');
console.log('\nYour AUTH0_SECRET:\n');
console.log(secret);
console.log('\nCopy this into your .env file for AUTH0_SECRET\n');
