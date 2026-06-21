import { HTTP_STATUS } from '../../config/constants.js';

/**
 * Standard API Response Format
 * Ensures consistent response structure across all endpoints
 */

/**
 * Success response
 */
export function successResponse(res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Error response
 */
export function errorResponse(res, message = 'Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Paginated response
 */
export function paginatedResponse(res, data, pagination, message = 'Success') {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * Created response (201)
 */
export function createdResponse(res, data, message = 'Created successfully') {
  return successResponse(res, data, message, HTTP_STATUS.CREATED);
}

/**
 * No content response (204)
 */
export function noContentResponse(res) {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
}
