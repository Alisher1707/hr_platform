import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from '../../config/constants.js';

/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting the number of requests from a single IP
 */

/**
 * General rate limiter (100 requests per 15 minutes)
 */
export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict limiter for auth endpoints (5 requests per 15 minutes)
 */
export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: 5,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Invite creation limiter (10 requests per hour)
 */
export const inviteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: 'Too many invite creation attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
