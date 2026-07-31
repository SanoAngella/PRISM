import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { ok } from '../utils/ApiResponse.js'
import Pharmacy from '../models/Pharmacy.js'
import Inventory from '../models/Inventory.js'

/** GET /api/pharmacies — optional geo sort with ?lat=&lng= or ?q= search. */
export const listPharmacies = asyncHandler(async (req, res) => {
  const { q, lat, lng, district } = req.query

  let query
  if (lat && lng) {
    query = Pharmacy.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        },
      },
    })
  } else {
    const filter = {}
    if (district) filter.district = district
    if (q) filter.name = { $regex: q, $options: 'i' }
    query = Pharmacy.find(filter).sort({ name: 1 })
  }

  const pharmacies = await query
  return ok(res, pharmacies, 'Pharmacies')
})

/** GET /api/pharmacies/:id — pharmacy profile + current stock. */
export const getPharmacy = asyncHandler(async (req, res) => {
  const pharmacy = await Pharmacy.findById(req.params.id)
  if (!pharmacy) throw ApiError.notFound('Pharmacy not found')

  const stock = await Inventory.find({ pharmacy: pharmacy._id }).populate('medicine')
  return ok(res, { ...pharmacy.toObject(), stock }, 'Pharmacy')
})

/** PATCH /api/pharmacies/:id — owner or admin. */
export const updatePharmacy = asyncHandler(async (req, res) => {
  const pharmacy = await Pharmacy.findById(req.params.id)
  if (!pharmacy) throw ApiError.notFound('Pharmacy not found')

  // Owners may only edit their own pharmacy.
  if (
    req.user.role !== 'admin' &&
    String(pharmacy.owner) !== String(req.user._id)
  ) {
    throw ApiError.forbidden('You can only update your own pharmacy')
  }

  const allowed = ['name', 'phone', 'email', 'district', 'sector', 'address', 'hours', 'open']
  for (const key of allowed) {
    if (req.body[key] !== undefined) pharmacy[key] = req.body[key]
  }
  await pharmacy.save()
  return ok(res, pharmacy, 'Pharmacy updated')
})
