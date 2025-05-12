const { param } = require('express-validator');

// Common validation function to check MongoDB ObjectId
const isValidObjectId = (value) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(value);
};

// Validation chains for user routes
const userValidators = {
  // PUT /user/game/:id
  addGameToUser: [
    param('id')
      .custom(isValidObjectId).withMessage('Invalid game ID format'),
  ],
};

module.exports = userValidators;