import mongoose from 'mongoose'
import Sale from '../models/Sale.js'
import Medicine from '../models/Medicine.js'
import Pharmacy from '../models/Pharmacy.js'
import Inventory from '../models/Inventory.js'
import Alert from '../models/Alert.js'
import { ALERT_STATUS } from '../utils/constants.js'

const DAY = 86400_000

/**
 * Daily units sold for the last `days`, optionally scoped to a pharmacy.
 */
export async function demandTrend({ days = 14, pharmacyId } = {}) {
  const since = new Date(Date.now() - days * DAY)
  const match = { soldAt: { $gte: since } }
  if (pharmacyId) match.pharmacy = new mongoose.Types.ObjectId(pharmacyId)

  const rows = await Sale.aggregate([
    { $match: match },
    {
      $lookup: { from: 'medicines', localField: 'medicine', foreignField: '_id', as: 'med' },
    },
    { $unwind: '$med' },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$soldAt' } },
          category: '$med.category',
        },
        units: { $sum: '$quantity' },
      },
    },
    { $sort: { '_id.date': 1 } },
  ])

  // Pivot into { date, <category>: units } records.
  const byDate = new Map()
  for (const r of rows) {
    const d = r._id.date
    if (!byDate.has(d)) byDate.set(d, { date: d })
    byDate.get(d)[r._id.category] = r.units
  }
  return Array.from(byDate.values())
}

/**
 * Units per category over a window, with % change vs the previous window.
 */
export async function categoryDemand({ days = 7 } = {}) {
  const now = Date.now()
  const current = await sumByCategory(new Date(now - days * DAY), new Date(now))
  const previous = await sumByCategory(new Date(now - 2 * days * DAY), new Date(now - days * DAY))

  const prevMap = Object.fromEntries(previous.map((p) => [p.category, p.units]))
  return current
    .map((c) => {
      const prev = prevMap[c.category] || 0
      const change = prev === 0 ? 100 : Math.round(((c.units - prev) / prev) * 100)
      return { ...c, change }
    })
    .sort((a, b) => b.units - a.units)
}

async function sumByCategory(from, to) {
  return Sale.aggregate([
    { $match: { soldAt: { $gte: from, $lt: to } } },
    { $lookup: { from: 'medicines', localField: 'medicine', foreignField: '_id', as: 'med' } },
    { $unwind: '$med' },
    { $group: { _id: '$med.category', units: { $sum: '$quantity' } } },
    { $project: { _id: 0, category: '$_id', units: 1 } },
  ])
}

/** Top medicines by units in the last `days`, with change vs previous window. */
export async function topMedicines({ days = 7, limit = 5 } = {}) {
  const now = Date.now()
  const cur = await sumByMedicine(new Date(now - days * DAY), new Date(now))
  const prev = await sumByMedicine(new Date(now - 2 * days * DAY), new Date(now - days * DAY))
  const prevMap = Object.fromEntries(prev.map((p) => [String(p.medicine), p.units]))

  return cur
    .map((c) => {
      const before = prevMap[String(c.medicine)] || 0
      const change = before === 0 ? 100 : Math.round(((c.units - before) / before) * 100)
      return { name: c.name, category: c.category, units: c.units, change }
    })
    .sort((a, b) => b.units - a.units)
    .slice(0, limit)
}

async function sumByMedicine(from, to) {
  return Sale.aggregate([
    { $match: { soldAt: { $gte: from, $lt: to } } },
    { $group: { _id: '$medicine', units: { $sum: '$quantity' } } },
    { $lookup: { from: 'medicines', localField: '_id', foreignField: '_id', as: 'med' } },
    { $unwind: '$med' },
    { $project: { _id: 0, medicine: '$_id', name: '$med.name', category: '$med.category', units: 1 } },
  ])
}

/** High-level KPIs for the authority dashboard. */
export async function authorityKpis() {
  const [activeAlerts, monitoredPharmacies] = await Promise.all([
    Alert.countDocuments({ status: { $ne: ALERT_STATUS.RESOLVED } }),
    Pharmacy.countDocuments(),
  ])
  const cats = await categoryDemand({ days: 7 })
  const avgChange = cats.length
    ? Math.round(cats.reduce((s, c) => s + c.change, 0) / cats.length)
    : 0
  return {
    activeAlerts,
    monitoredPharmacies,
    demandIndex: 100 + avgChange,
    populationCovered: monitoredPharmacies * 100000,
  }
}

/** Inventory summary for a single pharmacy. */
export async function pharmacyInventoryStats(pharmacyId) {
  const rows = await Inventory.find({ pharmacy: pharmacyId })
  const lowStock = rows.filter((r) => r.status === 'low').length
  const outOfStock = rows.filter((r) => r.status === 'out').length
  const stockValue = rows.reduce((s, r) => s + r.price * r.quantity, 0)
  return { totalItems: rows.length, lowStock, outOfStock, stockValue }
}
