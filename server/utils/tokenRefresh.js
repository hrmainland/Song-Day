const User = require("../models/user");

/**
 * Checks if a user's access token is valid and refreshes it if necessary
 * @param {Object} user - User object containing access_token and refresh_token
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
  
  // If token is still valid, return it
  if (tokenExpiryTime > currentTime + timeBuffer) {
    return user.access_token;
  }
  
  // Token is expired or will expire soon, refresh it
  if (!user.refresh_token) {
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
        refresh_token: user.refresh_token
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Token refresh failed: ${errorData.error_description || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Calculate token expiry time (subtract 5 minutes for safety)
    const expiryTime = Date.now() + (data.expires_in * 1000) - 300000;
    
    // Update user with new token information
    await User.findByIdAndUpdate(user._id, {
      access_token: data.access_token,
      token_expiry: expiryTime,
      // Only update refresh_token if a new one was provided
      ...(data.refresh_token && { refresh_token: data.refresh_token })
    });
    
    return data.access_token;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw new Error(`Failed to refresh access token: ${error.message}`);
  }
}

module.exports = { ensureValidToken };