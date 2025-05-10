const express = require("express");
const { ensureValidToken } = require("../utils/tokenRefresh");

const router = express.Router();

// Helper function for common Spotify API error handling
const handleSpotifyApiErrors = (response, res) => async () => {
  if (!response.ok) {
    const errorData = await response.json();
    
    // Handle rate limiting specifically
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || 60;
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Spotify API rate limit exceeded. Try again after ${retryAfter} seconds.`,
        retryAfter
      });
    }
    
    return res.status(response.status).json({
      error: errorData.error?.message || 'Spotify API error',
      message: errorData.error?.message || 'An error occurred while fetching from Spotify API'
    });
  }
  return false;
};


// TODO add auth middleware

/**
 * Search for tracks on Spotify
 * @route GET /spotify/searchTracks
 * @param {string} q - Search query
 * @returns {Object} Spotify search results
 */
router.get("/searchTracks", async (req, res) => {
  try {
    // Input validation
    const query = req.query.q;
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({ 
        error: 'Invalid search query',
        message: 'Search query (q) is required and must be a non-empty string'
      });
    }

    // Get a valid token
    const access_token = await ensureValidToken(req.user);



    // Make the request to Spotify API
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );


    // Handle Spotify API errors
    const error = await handleSpotifyApiErrors(response, res)();
    if (error) return error;


    // Return successful response
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in searchTracks:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
});

/**
 * Get multiple tracks by their Spotify IDs
 * @route GET /spotify/tracks
 * @param {string} ids - Comma-separated list of Spotify track IDs
 * @returns {Object} Array of Spotify track objects
 */
router.get("/tracks", async (req, res) => {
  try {
    // Input validation
    const ids = req.query.ids;
    if (!ids || typeof ids !== 'string' || ids.trim() === '') {
      return res.status(400).json({ 
        error: 'Invalid track IDs',
        message: 'Track IDs (ids) parameter is required and must be a non-empty string'
      });
    }

    // Check if we exceed Spotify's limit (max 50 IDs per request)
    const trackIds = ids.split(',').filter(id => id.trim() !== '');
    if (trackIds.length === 0) {
      return res.status(400).json({
        error: 'Invalid track IDs',
        message: 'No valid track IDs provided'
      });
    }
    
    if (trackIds.length > 50) {
      return res.status(400).json({
        error: 'Too many track IDs',
        message: 'Spotify API allows a maximum of 50 track IDs per request'
      });
    }

    // Get a valid token
    const access_token = await ensureValidToken(req.user);

    // Make the request to Spotify API
    const response = await fetch(
      `https://api.spotify.com/v1/tracks?ids=${encodeURIComponent(trackIds.join(','))}`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    // Handle Spotify API errors
    const error = await handleSpotifyApiErrors(response, res)();
    if (error) return error;

    // Return successful response
    const data = await response.json();
    return res.status(200).json(data.tracks);
  } catch (error) {
    console.error('Error in getMultipleTracksById:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
});

module.exports = router;