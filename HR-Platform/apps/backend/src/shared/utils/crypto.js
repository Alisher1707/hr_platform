import crypto from 'crypto';

/**
 * Crypto Utilities
 * Helper functions for cryptographic operations
 */

/**
 * Generate random invite token
 * Creates a URL-safe random token for invite links
 */
export function generateInviteToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate random string
 */
export function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash string using SHA256
 */
export function hashString(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * Generate secure random number
 */
export function generateRandomNumber(min = 0, max = 1000000) {
  const range = max - min;
  const randomBytes = crypto.randomBytes(4);
  const randomNumber = randomBytes.readUInt32BE(0) / 0xffffffff;
  return Math.floor(randomNumber * range) + min;
}
