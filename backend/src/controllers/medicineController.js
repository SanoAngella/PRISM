import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { ok, created, noContent } from '../utils/ApiResponse.js'
import Medicine from '../models/Medicine.js'
import Inventory from '../models/Inventory.js'
import { STOCK_STATUS } from '../utils/constants.js'

/** GET /api/medicines — searchable, filterable catalog. */
export const listMedicines = asyncHandler(async (req, res) => {
  const { q, category, page = 1, limit = 50 } = req.query
  const filter = {}
  if (category) filter.category = category
  if (q) filter.$or = [
    { name: { $regex: q, $options: 'i' } },
    { genericName: { $regex: q, $options: 'i' } },
  ]

  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Medicine.find(filter).sort({ name: 1 }).skip(skip).limit(Number(limit)),
    Medicine.countDocuments(filter),
  ])

  // Attach availability summary (how many pharmacies have stock).
  const withAvailability = await Promise.all(
    items.map(async (m) => {
      const stock = await Inventory.find({ medicine: m._id })
      const available = stock.filter((s) => s.status !== STOCK_STATUS.OUT)
      const prices = stock.map((s) => s.price)
      return {
        ...m.toObject(),
        availableCount: available.length,
        pharmacyCount: stock.length,
        fromPrice: prices.length ? Math.min(...prices) : m.unitPrice,
      }
    }),
  )

  return ok(res, withAvailability, 'Medicines', { total, page: Number(page), limit: Number(limit) })
})

/** GET /api/medicines/:id */
export const getMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id)
  if (!medicine) throw ApiError.notFound('Medicine not found')
  return ok(res, medicine, 'Medicine')
})

/** GET /api/medicines/:id/availability — where it's in stock, nearest first. */
export const getAvailability = asyncHandler(async (req, res) => {
  const rows = await Inventory.find({ medicine: req.params.id })
    .populate('pharmacy')
    .lean()
  const decorated = rows
    .filter((r) => r.pharmacy)
    .map((r) => ({ ...r, distance: null }))
  return ok(res, decorated, 'Availability')
})

/** POST /api/medicines — pharmacy/admin only. */
export const createMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.create(req.body)
  return created(res, medicine, 'Medicine created')
})

/** PATCH /api/medicines/:id */
export const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!medicine) throw ApiError.notFound('Medicine not found')
  return ok(res, medicine, 'Medicine updated')
})

/** DELETE /api/medicines/:id */
export const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findByIdAndDelete(req.params.id)
  if (!medicine) throw ApiError.notFound('Medicine not found')
  return noContent(res)
})
