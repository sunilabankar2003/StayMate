const { sendError } = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier: ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Multer error
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size is too large. Maximum allowed size is 5MB.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Too many files uploaded.';
    }
  }

  // Log in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error] ${statusCode} - ${message}`);
    if (statusCode === 500) console.error(err.stack);
  }

  return sendError(res, statusCode, message);
};

const notFoundHandler = (req, res) => {
  return sendError(res, 404, `Resource not found: ${req.method} ${req.originalUrl}`);
};

module.exports = { errorHandler, notFoundHandler };
