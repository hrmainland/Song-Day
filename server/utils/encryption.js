/**
 * Encryption utility for sensitive data
 * 
 * This module provides functions to encrypt and decrypt sensitive data like access tokens
 * using AES-256-GCM, a strong authenticated encryption algorithm.
 */

const crypto = require('crypto'); // Using built-in Node.js crypto module

// The encryption key should be set in environment variables
// For AES-256, we need a 32-byte (256-bit) key
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  
  // The key should be 32 bytes for AES-256
  if (Buffer.from(key, 'hex').length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
  }
  
  return key;
};

/**
 * Encrypts a string using AES-256-GCM
 * 
 * @param {string} text - The text to encrypt
 * @param {Buffer} [iv] - Optional initialization vector (16 bytes)
 * @returns {Object} - Object containing encrypted data and IV
 */
const encrypt = (text, providedIv = null) => {
  if (!text) return null;
  
  try {
    // Generate a random IV if not provided
    const iv = providedIv || crypto.randomBytes(16);
    
    // Create cipher using the encryption key and IV
    const cipher = crypto.createCipheriv(
      'aes-256-gcm', 
      Buffer.from(getEncryptionKey(), 'hex'), 
      iv
    );
    
    // Encrypt the data
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Get the authentication tag
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Return encrypted data, IV, and authentication tag
    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag
    };
  } catch (error) {
    console.error('Encryption error:', error.message);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypts encrypted data using AES-256-GCM
 * 
 * @param {string} encryptedData - The encrypted data in hex format
 * @param {string} iv - The initialization vector in hex format
 * @param {string} authTag - The authentication tag in hex format
 * @returns {string} - The decrypted text
 */
const decrypt = (encryptedData, iv, authTag) => {
  if (!encryptedData || !iv || !authTag) return null;
  
  try {
    // Create decipher
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(getEncryptionKey(), 'hex'),
      Buffer.from(iv, 'hex')
    );
    
    // Set authentication tag
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    throw new Error('Failed to decrypt data: Invalid data or encryption key');
  }
};

module.exports = {
  encrypt,
  decrypt
};