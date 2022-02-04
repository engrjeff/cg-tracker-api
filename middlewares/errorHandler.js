const { Error: MongoError } = require('mongoose');
const ErrorResponse = require('../utils/ErrorResponse');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // mongoose errors
  if (err instanceof MongoError.CastError) {
    const message = 'A certain resource cannot be found.';
    error = new ErrorResponse(404, message);
  }
  if (err instanceof MongoError.ValidationError) {
    const message = Object.values(error.errors).map((e) => ({
      property: e.path,
      message:
        e.kind === 'enum'
          ? `An invalid value for ${e.path} is provided`
          : e.message,
    }));
    error = new ErrorResponse(400, message);
  }
  if (error.code === 11000) {
    const keyValue = error.keyValue ? Object.keys(error.keyValue)[0] : 'value';
    const message = `The provided ${keyValue} is already in use.`;
    error = new ErrorResponse(400, message);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    errorCount: Array.isArray(error.message) ? error.message.length : 1,
    error: error.message || 'Server error',
  });
};

module.exports = errorHandler;
