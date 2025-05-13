/**
 * Utility script to generate a secure encryption key for AES-256
 * Run this with: node generateEncryptionKey.js
 */

const crypto = require('crypto');

// Generate a random 32-byte (256-bit) key and format as hex
const encryptionKey = crypto.randomBytes(32).toString('hex');

console.log('\n=== ENCRYPTION KEY GENERATED ===');
console.log(`\nENCRYPTION_KEY=${encryptionKey}\n`);