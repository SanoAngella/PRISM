import { validationResult } from 'express-validator'
import ApiError from '../utils/ApiError.js'

/**
 * Runs after an express-validator chain. Collects errors and throws a 400
 * with a field-keyed details object.
 */
export default function validate(req, _res, next) {
  const result = validationResult(req)
  if (result.isEmpty()) return next()

  const details = {}
  for (const err of result.array()) {
    if (!details[err.path]) details[err.path] = err.msg
  }
  next(ApiError.badRequest('Validation failed', details))
}
