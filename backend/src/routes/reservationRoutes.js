import { Router } from 'express'
import * as reservation from '../controllers/reservationController.js'
import { protect, authorize } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { reservationRules, mongoId } from '../validators/resourceValidators.js'
import { ROLES } from '../utils/constants.js'

const router = Router()

/**
 * @openapi
 * tags:
 *   - name: Reservations
 *     description: Medicine reservations
 */

/**
 * @openapi
 * /reservations:
 *   post:
 *     tags: [Reservations]
 *     summary: Reserve a medicine at a pharmacy
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [medicine, pharmacy, quantity, patientName, patientPhone]
 *             properties:
 *               medicine: { type: string }
 *               pharmacy: { type: string }
 *               quantity: { type: integer, example: 2 }
 *               patientName: { type: string }
 *               patientPhone: { type: string }
 *     responses:
 *       201: { description: Reservation confirmed }
 *   get:
 *     tags: [Reservations]
 *     summary: List reservations (scoped by role)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Reservations }
 */
router.post('/', protect, reservationRules, validate, reservation.createReservation)
router.get('/', protect, reservation.listReservations)

/**
 * @openapi
 * /reservations/{id}/status:
 *   patch:
 *     tags: [Reservations]
 *     summary: Update reservation fulfilment status (pharmacy)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Reservation updated }
 */
router.patch(
  '/:id/status',
  protect,
  authorize(ROLES.PHARMACY, ROLES.ADMIN),
  mongoId(),
  validate,
  reservation.updateStatus,
)

export default router
