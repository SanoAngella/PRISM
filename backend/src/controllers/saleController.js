import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { ok, created } from '../utils/ApiResponse.js'
import Sale from '../models/Sale.js'
import Inventory from '../models/Inventory.js'
import Medicine from '../models/Medicine.js'

function requirePharmacy(req) {
  const pharmacyId = req.user.pharmacy?._id || req.user.pharmacy
  if (!pharmacyId) throw ApiError.forbidden('No pharmacy linked to this account')
  return pharmacyId
}

/** POST /api/sales — record a sale and decrement inventory. */
export const recordSale = asyncHandler(async (req, res) => {
  const pharmacyId = requirePharmacy(req)
  const { medicine, quantity, channel } = req.body

  const [med, stock] = await Promise.all([
    Medicine.findById(medicine),
    Inventory.findOne({ pharmacy: pharmacyId, medicine }),
  ])
  if (!med) throw ApiError.notFound('Medicine not found')
  const unitPrice = stock?.price ?? med.unitPrice

  // Decrement stock if tracked.
  if (stock) {
    stock.quantity = Math.max(0, stock.quantity - quantity)
    await stock.save()
  }

  const sale = await Sale.create({
    pharmacy: pharmacyId,
    medicine,
    quantity,
    unitPrice,
    total: unitPrice * quantity,
    channel: channel || 'Walk-in',
  })
  const populated = await sale.populate('medicine')
  return created(res, populated, 'Sale recorded')
})

/** GET /api/sales — current pharmacy's sales. */
export const listSales = asyncHandler(async (req, res) => {
  const pharmacyId = requirePharmacy(req)
  const sales = await Sale.find({ pharmacy: pharmacyId })
    .populate('medicine')
    .sort({ soldAt: -1 })
    .limit(200)
  return ok(res, sales, 'Sales')
})

/** GET /api/sales/trend — 7-day revenue/units for the current pharmacy. */
export const salesTrend = asyncHandler(async (req, res) => {
  const pharmacyId = requirePharmacy(req)
  const since = new Date(Date.now() - 7 * 86400_000)
  const rows = await Sale.aggregate([
    { $match: { pharmacy: pharmacyId, soldAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$soldAt' } },
        units: { $sum: '$quantity' },
        revenue: { $sum: '$total' },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: '$_id', units: 1, revenue: 1 } },
  ])
  return ok(res, rows, 'Sales trend')
})
