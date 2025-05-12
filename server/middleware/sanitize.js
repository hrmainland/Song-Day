const sanitizeHtml = require('sanitize-html');

// Configure sanitize options (stricter than defaults)
const sanitizeOptions = {
  allowedTags: [], // No HTML tags allowed
  allowedAttributes: {}, // No attributes allowed
  disallowedTagsMode: 'recursiveEscape', // Escape rather than remove
};

/**
 * Middleware to sanitize specific request body fields
 * @param {Array} fields - Array of field names to sanitize
 * @returns {Function} Express middleware function
 */
const sanitizeBody = (fields) => {
  return (req, res, next) => {
    if (!req.body) return next();

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        // Handle nested fields like "settings.numSongs"
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          if (req.body[parent] && req.body[parent][child] !== undefined) {
            req.body[parent][child] = sanitizeHtml(
              req.body[parent][child].toString(),
              sanitizeOptions
            );
          }
        } else {
          // Handle top-level fields
          req.body[field] = sanitizeHtml(
            req.body[field].toString(),
            sanitizeOptions
          );
        }
      }
    });

    next();
  };
};

/**
 * Middleware to sanitize specific request parameters
 * @param {Array} params - Array of parameter names to sanitize
 * @returns {Function} Express middleware function
 */
const sanitizeParams = (params) => {
  return (req, res, next) => {
    params.forEach(param => {
      if (req.params[param] !== undefined) {
        req.params[param] = sanitizeHtml(
          req.params[param].toString(),
          sanitizeOptions
        );
      }
    });

    next();
  };
};

/**
 * Middleware to sanitize specific query parameters
 * @param {Array} queries - Array of query parameter names to sanitize
 * @returns {Function} Express middleware function
 */
const sanitizeQuery = (queries) => {
  return (req, res, next) => {
    queries.forEach(query => {
      if (req.query[query] !== undefined) {
        req.query[query] = sanitizeHtml(
          req.query[query].toString(),
          sanitizeOptions
        );
      }
    });

    next();
  };
};

module.exports = { 
  sanitizeBody,
  sanitizeParams,
  sanitizeQuery
};