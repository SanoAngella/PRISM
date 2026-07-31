import { Router } from 'express'
import * as pharmacy from '../controllers/pharmacyController.js'
import { protect, authorize } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { mongoId } from '../validators/resourceValidators.js'
import { ROLES } from '../utils/constants.js'

const router = Router()

/**
 * @openapi
 * tags:
 *   - name: Pharmacies
 *     description: Pharmacy directory and profiles
 */

/**
 * @openapi
 * /pharmacies:
 *   get:
 *     tags: [Pharmacies]
 *     summary: List pharmacies (optionally geo-sorted with lat/lng)
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema: { type: number }
 *       - in: query
 *         name: lng
 *         schema: { type: number }
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of pharmacies }
 */
router.get('/', pharmacy.listPharmacies)

/**
 * @openapi
 * /pharmacies/{id}:
 *   get:
 *     tags: [Pharmacies]
 *     summary: Get a pharmacy profile with its stock
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Pharmacy with stock }
 *       404: { description: Not found }
 */
router.get('/:id', mongoId(), validate, pharmacy.getPharmacy)

router.patch('/:id', protect, authorize(ROLES.PHARMACY, ROLES.ADMIN), mongoId(), validate, pharmacy.updatePharmacy)

export default router
