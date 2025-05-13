const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Game = require("./game");
const { encrypt, decrypt } = require("../utils/encryption");


// Define a schema for encrypted tokens with data, IV, and auth tag
const encryptedTokenSchema = new Schema({
  encryptedData: String,
  iv: String,
  authTag: String
}, { _id: false });

const userSchema = new Schema({
  name: String,
  spotify_id: { type: String, unique: true },
  spotify_display_name: String,

  // Replace string tokens with encrypted token objects
  access_token: encryptedTokenSchema,
  refresh_token: encryptedTokenSchema,

  token_expiry: { type: Number, default: 0 },

  // Flag to track terms acceptance
  hasAcceptedTerms: { type: Boolean, default: false },

  games: [
    {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
  ],
});

/**
 * Set an encrypted token
 * @param {string} tokenType - Either 'access_token' or 'refresh_token'
 * @param {string} plainToken - The plaintext token to encrypt
 */
userSchema.methods.setEncryptedToken = function(tokenType, plainToken) {
  if (!plainToken) {
    this[tokenType] = null;
    return;
  }

  // Encrypt the token and store it along with IV and auth tag
  const encrypted = encrypt(plainToken);
  this[tokenType] = encrypted;
};

/**
 * Get a decrypted token
 * @param {string} tokenType - Either 'access_token' or 'refresh_token'
 * @returns {string|null} - The decrypted token or null if not available
 */
userSchema.methods.getDecryptedToken = function(tokenType) {
  const tokenData = this[tokenType];

  // Return null if token data is missing or incomplete
  if (!tokenData || !tokenData.encryptedData || !tokenData.iv || !tokenData.authTag) {
    return null;
  }

  // Decrypt and return the token
  try {
    return decrypt(tokenData.encryptedData, tokenData.iv, tokenData.authTag);
  } catch (error) {
    console.error(`Error decrypting ${tokenType}:`, error.message);
    return null;
  }
};

// Virtual properties to make token access easier in existing code
userSchema.virtual('decryptedAccessToken').get(function() {
  return this.getDecryptedToken('access_token');
});

userSchema.virtual('decryptedRefreshToken').get(function() {
  return this.getDecryptedToken('refresh_token');
});

module.exports = mongoose.model("User", userSchema);
