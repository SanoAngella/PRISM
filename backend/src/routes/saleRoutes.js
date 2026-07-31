import { Router } from 'express'
import * as sale from '../controllers/saleController.js'
import { protect, authorize } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { saleRules } from '../validators/resourceValidators.js'
import { ROLES } from '../utils/constants.js'

const router = Router()

router.use(protect, authorize(ROLES.PHARMACY, ROLES.ADMIN))

/**
 * @openapi
 * tags:
 *   - name: Sales
 *     description: Pharmacy sales
 */

/**
 * @openapi
 * /sales:
 *   get:
 *     tags: [Sales]
 *     summary: List the current pharmacy's sales
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Sales }
 *   post:
 *     tags: [Sales]
 *     summary: Record a sale (decrements stock)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Sale recorded }
 */
router.get('/', sale.listSales)
router.get('/trend', sale.salesTrend)
router.post('/', saleRules, validate, sale.recordSale)

export default router
