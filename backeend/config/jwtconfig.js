const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '/backeend/src/.env') });
const crypto = require('crypto');

// Use the JWT_SECRET from the environment, or fallback to a randomly generated key if not set
const secretkey = process.env.JWT_SECRET;

const refreshKey=process.env.JWT_PRIVATE;
console.log('All env vars:', process.env);
console.log('secretkey:', secretkey);  // Should print the value of JWT_SECRET
console.log('refreshKey:', refreshKey);  // Should print the value of JWT_PRIVATE

module.exports = { secretkey,refreshKey };
