const { validationResult } = require('express-validator');

// Middleware to check for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array(),
      message: 'Validation failed' 
    });
  }
  next();
};

module.exports = {
  validate,
  gameValidators: require('./gameValidators'),
  trackGroupValidators: require('./trackGroupValidators'),
  userValidators: require('./userValidators'),
};