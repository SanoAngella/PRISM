import asyncHandler from '../utils/asyncHandler.js'
import { ok } from '../utils/ApiResponse.js'
import Alert from '../models/Alert.js'
import * as analytics from '../services/analyticsService.js'
import { ALERT_STATUS } from '../utils/constants.js'

/** GET /api/analytics/dashboard — authority overview payload. */
export const dashboard = asyncHandler(async (req, res) => {
  const [kpis, demandTrend, categoryDemand, topMedicines, activeAlerts] = await Promise.all([
    analytics.authorityKpis(),
    analytics.demandTrend({ days: 14 }),
    analytics.categoryDemand({ days: 7 }),
    analytics.topMedicines({ days: 7, limit: 5 }),
    Alert.find({ status: { $ne: ALERT_STATUS.RESOLVED } }).sort({ detectedAt: -1 }).limit(3),
  ])
  return ok(res, { kpis, demandTrend, categoryDemand, topMedicines, activeAlerts }, 'Dashboard')
})

/** GET /api/analytics/demand */
export const demand = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 14
  const [trend, categories, top] = await Promise.all([
    analytics.demandTrend({ days }),
    analytics.categoryDemand({ days: 7 }),
    analytics.topMedicines({ days: 7, limit: 8 }),
  ])
  return ok(res, { trend, categories, top }, 'Demand analytics')
})

/** GET /api/analytics/hotspots — district anomaly scores derived from alerts + demand. */
export const hotspots = asyncHandler(async (req, res) => {
  const categories = await analytics.categoryDemand({ days: 7 })
  const activeAlerts = await Alert.find({ status: { $ne: ALERT_STATUS.RESOLVED } })

  // Build a simple per-district score from active alerts.
  const byDistrict = {}
  for (const a of activeAlerts) {
    byDistrict[a.district] = byDistrict[a.district] || { district: a.district, sector: a.sector, score: 0, cases: 0, signal: a.signal }
    byDistrict[a.district].score = Math.max(byDistrict[a.district].score, a.confidence)
    byDistrict[a.district].cases += a.caseEstimate
  }
  return ok(res, Object.values(byDistrict), 'Hotspots')
})
