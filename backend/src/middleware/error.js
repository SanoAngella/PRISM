import env from '../config/env.js'
import ApiError from '../utils/ApiError.js'
import logger from '../utils/logger.js'

/** 404 handler for unmatched routes. */
export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`))
}

/** Central error handler — converts any thrown error into a JSON envelope. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'
  let details = err.details || null

  // Mongoose: bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${err.path}: ${err.value}`
  }
  // Mongoose: duplicate key
  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    message = `Duplicate value for ${field}`
    details = err.keyValue
  }
  // Mongoose: schema validation
  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation failed'
    details = Object.fromEntries(
      Object.values(err.errors).map((e) => [e.path, e.message]),
    )
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} → ${err.stack || err.message}`)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { errors: details }),
    ...(!env.isProd && statusCode >= 500 && { stack: err.stack }),
  })
}
