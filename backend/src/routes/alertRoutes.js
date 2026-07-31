import { Router } from 'express'
import * as alert from '../controllers/alertController.js'
import { protect, authorize } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { mongoId } from '../validators/resourceValidators.js'
import { ROLES } from '../utils/constants.js'

const router = Router()

router.use(protect, authorize(ROLES.AUTHORITY, ROLES.ADMIN))

/**
 * @openapi
 * tags:
 *   - name: Alerts
 *     description: AI-generated outbreak alerts
 */

/**
 * @openapi
 * /alerts:
 *   get:
 *     tags: [Alerts]
 *     summary: List outbreak alerts
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, monitoring, resolved] }
 *     responses:
 *       200: { description: Alerts }
 */
router.get('/', alert.listAlerts)

/**
 * @openapi
 * /alerts/run-detection:
 *   post:
 *     tags: [Alerts]
 *     summary: Run the AI outbreak detection pass now
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Detection result }
 */
router.post('/run-detection', alert.triggerDetection)

/**
 * @openapi
 * /alerts/{id}:
 *   get:
 *     tags: [Alerts]
 *     summary: Get an alert by id
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Alert }
 */
router.get('/:id', mongoId(), validate, alert.getAlert)
router.patch('/:id/status', mongoId(), validate, alert.updateAlertStatus)

export default router
