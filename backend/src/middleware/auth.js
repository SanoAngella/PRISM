import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { verifyToken } from '../utils/token.js'
import User from '../models/User.js'

/**
 * Verifies the Bearer JWT and attaches the current user to req.user.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  let token
  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1]
  }
  if (!token) throw ApiError.unauthorized('Authentication required')

  let decoded
  try {
    decoded = verifyToken(token)
  } catch {
    throw ApiError.unauthorized('Invalid or expired token')
  }

  const user = await User.findById(decoded.sub).populate('pharmacy')
  if (!user || !user.active) throw ApiError.unauthorized('Account not found or inactive')

  req.user = user
  next()
})

/**
 * Restricts a route to one or more roles. Use after `protect`.
 * @param  {...string} roles
 */
export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized())
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have access to this resource'))
    }
    next()
  }
