import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { ok, created, noContent } from '../utils/ApiResponse.js'
import Inventory from '../models/Inventory.js'
import { pharmacyInventoryStats } from '../services/analyticsService.js'

// Resolve the pharmacy managed by the current user.
function requirePharmacy(req) {
  const pharmacyId = req.user.pharmacy?._id || req.user.pharmacy
  if (!pharmacyId) throw ApiError.forbidden('No pharmacy linked to this account')
  return pharmacyId
}

/** GET /api/inventory — current pharmacy's stock. */
export const getMyInventory = asyncHandler(async (req, res) => {
  const pharmacyId = requirePharmacy(req)
  const items = await Inventory.find({ pharmacy: pharmacyId }).populate('medicine').sort({ updatedAt: -1 })
  return ok(res, items, 'Inventory')
})

/** GET /api/inventory/stats */
export const getStats = asyncHandler(async (req, res) => {
  const pharmacyId = requirePharmacy(req)
  const stats = await pharmacyInventoryStats(pharmacyId)
  return ok(res, stats, 'Inventory stats')
})

/** POST /api/inventory — add a medicine to stock. */
export const addStock = asyncHandler(async (req, res) => {
  const pharmacyId = requirePharmacy(req)
  const { medicine, quantity, reorderLevel, price, batchNo, expiryDate } = req.body

  const existing = await Inventory.findOne({ pharmacy: pharmacyId, medicine })
  if (existing) throw ApiError.conflict('This medicine is already in your inventory')

  const item = await Inventory.create({
    pharmacy: pharmacyId,
    medicine,
    quantity,
    reorderLevel,
    price,
    batchNo,
    expiryDate,
  })
  const populated = await item.populate('medicine')
  return created(res, populated, 'Stock added')
})

/** PATCH /api/inventory/:id — update quantity/price. */
export const updateStock = asyncHandler(async (req, res) => {
  const pharmacyId = requirePharmacy(req)
  const item = await Inventory.findOne({ _id: req.params.id, pharmacy: pharmacyId })
  if (!item) throw ApiError.notFound('Inventory item not found')

  const fields = ['quantity', 'reorderLevel', 'price', 'batchNo', 'expiryDate']
  for (const f of fields) if (req.body[f] !== undefined) item[f] = req.body[f]
  await item.save() // pre-save hook recomputes status
  const populated = await item.populate('medicine')
  return ok(res, populated, 'Stock updated')
})

/** DELETE /api/inventory/:id */
export const removeStock = asyncHandler(async (req, res) => {
  const pharmacyId = requirePharmacy(req)
  const item = await Inventory.findOneAndDelete({ _id: req.params.id, pharmacy: pharmacyId })
  if (!item) throw ApiError.notFound('Inventory item not found')
  return noContent(res)
})
