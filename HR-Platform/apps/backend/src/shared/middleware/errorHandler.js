import { HTTP_STATUS, MESSAGES } from '../../config/constants.js';
import { config } from '../../config/env.js';

/**
 * Global Error Handler Middleware
 * Catches all errors and sends standardized error responses
 */
export function errorHandler(err, req, res, next) {
  // Log error in development
  if (config.env === 'development') {
    console.error('❌ Error:', err);
  }

  // Default error
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || MESSAGES.SERVER_ERROR;
  let errors = err.errors || null;

  // Joi validation error
  if (err.isJoi) {
    statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY;
    message = MESSAGES.VALIDATION_ERROR;
    errors = err.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = MESSAGES.TOKEN_INVALID;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = MESSAGES.TOKEN_EXPIRED;
  }

  // PostgreSQL errors
  if (err.code === '23505') {
    // Unique violation
    statusCode = HTTP_STATUS.CONFLICT;
    message = 'Resource already exists';
  }

  if (err.code === '23503') {
    // Foreign key violation
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Referenced resource not found';
  }

  if (err.code === '22P02') {
    // Invalid text representation
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid data format';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(config.env === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Not Found Handler
 * Handles 404 errors for undefined routes
 */
export function notFoundHandler(req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors automatically
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
