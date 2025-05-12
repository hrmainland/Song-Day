const { body, param, query } = require('express-validator');

// Common validation function to check MongoDB ObjectId
const isValidObjectId = (value) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(value);
};

// Validation chains for game routes
const gameValidators = {
  // POST /game/new
  createGame: [
    body('gameName')
      .trim()
      .notEmpty().withMessage('Game name is required')
      .isLength({ min: 1, max: 50 }).withMessage('Game name must be between 1 and 50 characters'),
    
    body('settings.numSongs')
      .isInt({ min: 1, max: 100 }).withMessage('Number of songs must be between 1 and 100'),
    
    body('settings.numVotes')
      .isInt({ min: 1, max: 100 }).withMessage('Number of votes must be between 1 and 100'),
  ],

  // PUT /game/:gameId/display-name
  updateDisplayName: [
    param('gameId')
      .custom(isValidObjectId).withMessage('Invalid game ID format'),
    
    body('displayName')
      .trim()
      .notEmpty().withMessage('Display name is required')
      .isLength({ min: 1, max: 20 }).withMessage('Display name must be between 1 and 20 characters'),
  ],

  // POST /game/:gameId/vote-group
  createVoteGroup: [
    param('gameId')
      .custom(isValidObjectId).withMessage('Invalid game ID format'),
    
    body('items')
      .isArray().withMessage('Items must be an array')
      .notEmpty().withMessage('Items array cannot be empty'),
    
    body('items.*.trackId')
      .notEmpty().withMessage('Track ID is required for each vote item')
      .isString().withMessage('Track ID must be a string'),
    
    body('items.*.vote')
      .isInt({ min: 0 }).withMessage('Vote must be a non-negative integer'),
  ],

  // PUT /game/:gameId/track-group/:trackGroupId
  addTrackGroup: [
    param('gameId')
      .custom(isValidObjectId).withMessage('Invalid game ID format'),
    
    param('trackGroupId')
      .custom(isValidObjectId).withMessage('Invalid track group ID format'),
  ],

  // GET /game/:gameCode
  getGameByCode: [
    param('gameCode')
      .trim()
      .notEmpty().withMessage('Game code is required')
      .isLength({ min: 12, max: 12 }).withMessage('Game code must be exactly 12 characters')
      .isAlphanumeric().withMessage('Game code must contain only letters and numbers'),
    
    query('authRequired')
      .optional()
      .isBoolean().withMessage('authRequired must be a boolean value'),
  ],

  // POST /game/:gameId/move-to-voting
  moveToVoting: [
    param('gameId')
      .custom(isValidObjectId).withMessage('Invalid game ID format'),
  ],

  // DELETE /game/:gameId/remove-player/:userId
  removePlayer: [
    param('gameId')
      .custom(isValidObjectId).withMessage('Invalid game ID format'),
    
    param('userId')
      .custom(isValidObjectId).withMessage('Invalid user ID format'),
  ],

  // PUT /game/:gameId/add-me
  addMe: [
    param('gameId')
      .custom(isValidObjectId).withMessage('Invalid game ID format'),
  ],
};

module.exports = gameValidators;
