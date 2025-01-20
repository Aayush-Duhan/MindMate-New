const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Common validation rules
exports.commonValidations = {
  id: {
    in: ['params'],
    isMongoId: true,
    errorMessage: 'Invalid ID format'
  },
  email: {
    isEmail: true,
    normalizeEmail: true,
    errorMessage: 'Invalid email address'
  },
  password: {
    isLength: { min: 6 },
    errorMessage: 'Password must be at least 6 characters long'
  }
}; 