import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { ok } from '../utils/ApiResponse.js'
import Alert from '../models/Alert.js'
import { runDetection } from '../services/aiAlertService.js'
import { ALERT_STATUS } from '../utils/constants.js'

/** GET /api/alerts */
export const listAlerts = asyncHandler(async (req, res) => {
  const filter = {}
  if (req.query.status) filter.status = req.query.status
  if (req.query.district) filter.district = req.query.district
  const alerts = await Alert.find(filter).sort({ detectedAt: -1 })
  return ok(res, alerts, 'Alerts')
})

/** GET /api/alerts/:id */
export const getAlert = asyncHandler(async (req, res) => {
  const alert = await Alert.findById(req.params.id)
  if (!alert) throw ApiError.notFound('Alert not found')
  return ok(res, alert, 'Alert')
})

/** PATCH /api/alerts/:id/status */
export const updateAlertStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  if (!Object.values(ALERT_STATUS).includes(status)) throw ApiError.badRequest('Invalid status')
  const alert = await Alert.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!alert) throw ApiError.notFound('Alert not found')
  return ok(res, alert, 'Alert updated')
})

/** POST /api/alerts/run-detection — manually trigger the AI detection pass. */
export const triggerDetection = asyncHandler(async (req, res) => {
  const created = await runDetection({ windowDays: Number(req.body?.windowDays) || 4 })
  return ok(res, created, `Detection complete — ${created.length} new alert(s)`)
})
