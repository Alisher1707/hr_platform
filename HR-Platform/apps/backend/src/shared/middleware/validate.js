import Joi from 'joi';
import { HTTP_STATUS, MESSAGES } from '../../config/constants.js';

/**
 * Validation Middleware
 * Validates request body, query, and params using Joi schemas
 */

/**
 * Validate request using Joi schema
 */
export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: MESSAGES.VALIDATION_ERROR,
        errors,
        timestamp: new Date().toISOString(),
      });
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
}

/**
 * Validate query parameters
 */
export function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: MESSAGES.VALIDATION_ERROR,
        errors,
        timestamp: new Date().toISOString(),
      });
    }

    req.query = value;
    next();
  };
}

/**
 * Validate URL parameters
 */
export function validateParams(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: MESSAGES.VALIDATION_ERROR,
        errors,
        timestamp: new Date().toISOString(),
      });
    }

    req.params = value;
    next();
  };
}

/**
 * Common Joi schemas for reuse
 */
export const commonSchemas = {
  uuid: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  phone: Joi.string().pattern(/^[\d\s\-\+\(\)]+$/).min(10).max(20),
  date: Joi.date().iso().allow('', null),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};
