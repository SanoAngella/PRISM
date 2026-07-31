import { Router } from 'express'
import * as medicine from '../controllers/medicineController.js'
import { protect, authorize } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { medicineRules, mongoId } from '../validators/resourceValidators.js'
import { ROLES } from '../utils/constants.js'

const router = Router()

/**
 * @openapi
 * tags:
 *   - name: Medicines
 *     description: Medicine catalog and availability
 */

/**
 * @openapi
 * /medicines:
 *   get:
 *     tags: [Medicines]
 *     summary: List / search medicines
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search by name or generic name
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of medicines with availability }
 */
router.get('/', medicine.listMedicines)

/**
 * @openapi
 * /medicines/{id}:
 *   get:
 *     tags: [Medicines]
 *     summary: Get a medicine by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Medicine }
 *       404: { description: Not found }
 */
router.get('/:id', mongoId(), validate, medicine.getMedicine)

/**
 * @openapi
 * /medicines/{id}/availability:
 *   get:
 *     tags: [Medicines]
 *     summary: Where a medicine is in stock
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Availability across pharmacies }
 */
router.get('/:id/availability', mongoId(), validate, medicine.getAvailability)

// Write operations — pharmacy or admin only.
router.post('/', protect, authorize(ROLES.PHARMACY, ROLES.ADMIN), medicineRules, validate, medicine.createMedicine)
router.patch('/:id', protect, authorize(ROLES.PHARMACY, ROLES.ADMIN), mongoId(), validate, medicine.updateMedicine)
router.delete('/:id', protect, authorize(ROLES.ADMIN), mongoId(), validate, medicine.deleteMedicine)

export default router
