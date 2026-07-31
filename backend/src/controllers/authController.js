import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { ok, created } from '../utils/ApiResponse.js'
import { signToken } from '../utils/token.js'
import User from '../models/User.js'
import Pharmacy from '../models/Pharmacy.js'
import { ROLES } from '../utils/constants.js'

function issue(user) {
  const token = signToken({ sub: user.id, role: user.role })
  return { token, user }
}

/** POST /api/auth/register — patient self-registration. */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body
  const exists = await User.findOne({ email })
  if (exists) throw ApiError.conflict('An account with this email already exists')

  const user = await User.create({ name, email, password, phone, role: ROLES.PATIENT })
  return created(res, issue(user), 'Account created')
})

/** POST /api/auth/register-pharmacy — creates a pharmacy + its owner account. */
export const registerPharmacy = asyncHandler(async (req, res) => {
  const { pharmacyName, licenseNo, email, phone, district, sector, address, password } = req.body

  const exists = await User.findOne({ email })
  if (exists) throw ApiError.conflict('An account with this email already exists')

  const pharmacy = await Pharmacy.create({
    name: pharmacyName,
    licenseNo,
    email,
    phone,
    district,
    sector,
    address,
  })

  const user = await User.create({
    name: pharmacyName,
    email,
    password,
    phone,
    role: ROLES.PHARMACY,
    organization: pharmacyName,
    pharmacy: pharmacy._id,
  })
  pharmacy.owner = user._id
  await pharmacy.save()

  const populated = await user.populate('pharmacy')
  return created(res, issue(populated), 'Pharmacy registered')
})

/** POST /api/auth/login */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+password').populate('pharmacy')
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password')
  }
  if (!user.active) throw ApiError.forbidden('Account is inactive')

  user.password = undefined
  return ok(res, issue(user), 'Signed in')
})

/** GET /api/auth/me */
export const me = asyncHandler(async (req, res) => {
  return ok(res, req.user, 'Current user')
})
