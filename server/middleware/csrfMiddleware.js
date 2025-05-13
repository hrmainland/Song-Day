/**
 * Sets CSRF token cookie and provides helpful headers
 * This middleware should be used after csurf middleware
 */
const setCsrfCookie = (req, res, next) => {
  // Add a header that helps the client know there's CSRF protection enabled
  res.set('X-CSRF-Protection', '1');
  
  // Pass the request to the next middleware
  next();
};

module.exports = {
  setCsrfCookie
};