const User = require("../models/user");
const { encrypt } = require("./encryption");

/**
 * Checks if a user's access token is valid and refreshes it if necessary
 * @param {Object} user - User object containing encrypted access_token and refresh_token
 * @returns {Promise<string>} Valid access token
 * @throws {Error} If token refresh fails
 */
async function ensureValidToken(user) {
  if (!user) {
    throw new Error("User is required");
  }

  // Check if token is expired (or will expire soon)
  const tokenExpiryTime = user.token_expiry || 0;
  const currentTime = Date.now();
  const timeBuffer = 60000; // 1 minute buffer to prevent edge cases

  // If token is still valid, return it decrypted
  if (tokenExpiryTime > currentTime + timeBuffer) {
    return user.decryptedAccessToken;
  }

  // Get the decrypted refresh token
  const refreshToken = user.decryptedRefreshToken;

  // Token is expired or will expire soon, refresh it
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        ).toString("base64")}`
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Token refresh failed: ${errorData.error_description || response.statusText}`);
    }

    const data = await response.json();

    // Calculate token expiry time (subtract 5 minutes for safety)
    const expiryTime = Date.now() + (data.expires_in * 1000) - 300000;

    // Get the user so we can use instance methods for encryption
    const userDoc = await User.findById(user._id);
    if (!userDoc) {
      throw new Error("User not found when refreshing token");
    }

    // Encrypt the new tokens
    userDoc.setEncryptedToken('access_token', data.access_token);
    userDoc.token_expiry = expiryTime;

    // Only update refresh_token if a new one was provided
    if (data.refresh_token) {
      userDoc.setEncryptedToken('refresh_token', data.refresh_token);
    }

    await userDoc.save();

    return data.access_token;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw new Error(`Failed to refresh access token: ${error.message}`);
  }
}

module.exports = { ensureValidToken };