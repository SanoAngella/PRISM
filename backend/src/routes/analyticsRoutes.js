import { Router } from 'express'
import * as analytics from '../controllers/analyticsController.js'
import { protect, authorize } from '../middleware/auth.js'
import { ROLES } from '../utils/constants.js'

const router = Router()

// Analytics are for health authorities (and admins).
router.use(protect, authorize(ROLES.AUTHORITY, ROLES.ADMIN))

/**
 * @openapi
 * tags:
 *   - name: Analytics
 *     description: Health authority surveillance analytics
 */

/**
 * @openapi
 * /analytics/dashboard:
 *   get:
 *     tags: [Analytics]
 *     summary: Authority dashboard payload (KPIs, demand, alerts)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Dashboard data }
 */
router.get('/dashboard', analytics.dashboard)

/**
 * @openapi
 * /analytics/demand:
 *   get:
 *     tags: [Analytics]
 *     summary: Demand trend, category breakdown and top medicines
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Demand analytics }
 */
router.get('/demand', analytics.demand)

/**
 * @openapi
 * /analytics/hotspots:
 *   get:
 *     tags: [Analytics]
 *     summary: District-level anomaly hotspots
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Hotspots }
 */
router.get('/hotspots', analytics.hotspots)

export default router
