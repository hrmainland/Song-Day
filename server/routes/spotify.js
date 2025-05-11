const express = require("express");
const { ensureValidToken } = require("../utils/tokenRefresh");
const { isLoggedIn } = require("../middleware");

const router = express.Router();

/**
 * Makes a request to the Spotify API with automatic retry for rate limiting
 * @param {string} url - The Spotify API endpoint URL
 * @param {string} access_token - Valid Spotify access token
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} body - Request body for POST/PUT requests
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<Object>} Response object with data and status info
 */
const spotifyApiRequest = async (
  url,
  access_token,
  method = "GET",
  body = null,
  maxRetries = 3
) => {
  let retryCount = 0;
  let lastError = null;

  const options = {
    method,
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  };

  if (body && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(body);
  }

  while (retryCount <= maxRetries) {
    try {
      const response = await fetch(url, options);

      // Check if rate limited (429)
      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get("Retry-After") || "60",
          10
        );
        console.warn(
          `Rate limited by Spotify API. Retry attempt ${retryCount + 1}/${
            maxRetries + 1
          }. Waiting ${retryAfter} seconds...`
        );

        // If we've exhausted our retries, return the error response
        if (retryCount === maxRetries) {
          const errorData = await response.json().catch(() => ({}));
          return {
            ok: false,
            status: 429,
            statusText: "Too Many Requests",
            retryAfter,
            data: errorData,
            headers: response.headers,
          };
        }

        // Wait for the specified time before retrying
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        retryCount++;
        continue;
      }

      // For successful responses or non-429 errors, parse and return
      try {
        const data = await response.json();
        return {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          data,
          headers: response.headers,
        };
      } catch (e) {
        // If we can't parse JSON (e.g., empty response)
        return {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          data: {},
          headers: response.headers,
        };
      }
    } catch (error) {
      // Network errors, retrying
      lastError = error;

      if (retryCount < maxRetries) {
        const backoffTime = Math.pow(2, retryCount) * 1000;
        console.warn(
          `Network error when calling Spotify API. Retry attempt ${
            retryCount + 1
          }/${maxRetries + 1}. Waiting ${backoffTime / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        retryCount++;
      } else {
        // Exhausted retries, throw the last error
        throw error;
      }
    }
  }

  // If we've exhausted retries due to network errors
  throw (
    lastError ||
    new Error("Failed to connect to Spotify API after multiple retries")
  );
};

// TODO add auth middleware

/**
 * Search for tracks on Spotify
 * @route GET /spotify/searchTracks
 * @param {string} q - Search query
 * @returns {Object} Spotify search results
 */
router.get("/searchTracks", isLoggedIn, async (req, res) => {
  try {
    // Input validation
    const query = req.query.q;
    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({
        error: "Invalid search query",
        message: "Search query (q) is required and must be a non-empty string",
      });
    }

    // Get a valid token
    const access_token = await ensureValidToken(req.user);

    // Make the request to Spotify API with automatic retry
    const apiResponse = await spotifyApiRequest(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track`,
      access_token
    );

    // Check for API errors
    if (!apiResponse.ok) {
      // Pass along error from Spotify API
      return res.status(apiResponse.status).json({
        error: apiResponse.data.error?.message || "Spotify API error",
        message:
          apiResponse.data.error?.message ||
          `Error from Spotify API: ${apiResponse.statusText}`,
      });
    }

    // Return successful response
    return res.status(200).json(apiResponse.data);
  } catch (error) {
    console.error("Error in searchTracks:", error);
    return res.status(500).json({
      error: "Server error",
      message: "An unexpected error occurred while processing your request",
    });
  }
});

/**
 * Get multiple tracks by their Spotify IDs
 * @route GET /spotify/tracks
 * @param {string} ids - Comma-separated list of Spotify track IDs
 * @returns {Object} Array of Spotify track objects
 */
router.get("/tracks", isLoggedIn, async (req, res) => {
  try {
    // Input validation
    const ids = req.query.ids;
    if (!ids || typeof ids !== "string" || ids.trim() === "") {
      return res.status(400).json({
        error: "Invalid track IDs",
        message:
          "Track IDs (ids) parameter is required and must be a non-empty string",
      });
    }

    // Check if we exceed Spotify's limit (max 50 IDs per request)
    const trackIds = ids.split(",").filter((id) => id.trim() !== "");
    if (trackIds.length === 0) {
      return res.status(400).json({
        error: "Invalid track IDs",
        message: "No valid track IDs provided",
      });
    }

    if (trackIds.length > 50) {
      return res.status(400).json({
        error: "Too many track IDs",
        message: "Spotify API allows a maximum of 50 track IDs per request",
      });
    }

    // Get a valid token
    const access_token = await ensureValidToken(req.user);

    // Make the request to Spotify API with automatic retry
    const apiResponse = await spotifyApiRequest(
      `https://api.spotify.com/v1/tracks?ids=${encodeURIComponent(
        trackIds.join(",")
      )}`,
      access_token
    );

    // Check for API errors
    if (!apiResponse.ok) {
      // Pass along error from Spotify API
      return res.status(apiResponse.status).json({
        error: apiResponse.data.error?.message || "Spotify API error",
        message:
          apiResponse.data.error?.message ||
          `Error from Spotify API: ${apiResponse.statusText}`,
      });
    }

    // Return successful response
    return res.status(200).json(apiResponse.data.tracks);
  } catch (error) {
    console.error("Error in getMultipleTracksById:", error);
    return res.status(500).json({
      error: "Server error",
      message: "An unexpected error occurred while processing your request",
    });
  }
});

module.exports = router;
