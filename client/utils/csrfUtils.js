/**
 * Utility functions for handling CSRF tokens
 */

import baseUrl from "./urlPrefix.js";

// Cache the CSRF token in memory
let csrfToken = null;

/**
 * Fetches a new CSRF token from the server
 * @returns {Promise<string>} The CSRF token
 */
export const fetchCsrfToken = async () => {
  try {
    const response = await fetch(`${baseUrl}/csrf-token`, {
      credentials: 'include', // Important to include cookies
    });

    if (!response.ok) {
      console.error(`CSRF token fetch failed with status: ${response.status}`);
      throw new Error(`Failed to fetch CSRF token: ${response.status}`);
    }
    
    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

/**
 * Gets the current CSRF token, fetching a new one if needed
 * @returns {Promise<string>} The CSRF token
 */
export const getCsrfToken = async () => {
  if (!csrfToken) {
    return fetchCsrfToken();
  }
  return csrfToken;
};

/**
 * Adds CSRF token to fetch headers
 * @param {Object} headers - Headers object to add the token to
 * @returns {Promise<Object>} Headers with CSRF token added
 */
export const addCsrfHeader = async (headers = {}) => {
  const token = await getCsrfToken();
  return {
    ...headers,
    'CSRF-Token': token,
  };
};

/**
 * Invalidates the cached CSRF token, forcing a new fetch on next request
 */
export const invalidateCsrfToken = () => {
  csrfToken = null;
};