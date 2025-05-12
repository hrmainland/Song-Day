const { body, param } = require('express-validator');

// Common validation function to check MongoDB ObjectId
const isValidObjectId = (value) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(value);
};

// Validation chains for trackGroup routes
const trackGroupValidators = {
  // POST /trackGroup
  createTrackGroup: [
    body('sessionTracks')
      .isArray().withMessage('Session tracks must be an array')
      .notEmpty().withMessage('Session tracks array cannot be empty'),
    
    body('sessionTracks.*.id')
      .notEmpty().withMessage('Track ID is required')
      .isString().withMessage('Track ID must be a string'),
  ],

  // DELETE /trackGroup/:id
  deleteTrackGroup: [
    param('id')
      .custom(isValidObjectId).withMessage('Invalid track group ID format'),
  ],
};

module.exports = trackGroupValidators;