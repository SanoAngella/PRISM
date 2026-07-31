import { Router } from 'express'
import * as inventory from '../controllers/inventoryController.js'
import { protect, authorize } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { addStockRules, updateStockRules, mongoId } from '../validators/resourceValidators.js'
import { ROLES } from '../utils/constants.js'

const router = Router()

// All inventory routes are pharmacy-scoped.
router.use(protect, authorize(ROLES.PHARMACY, ROLES.ADMIN))

/**
 * @openapi
 * tags:
 *   - name: Inventory
 *     description: Pharmacy stock management (pharmacy role)
 */

/**
 * @openapi
 * /inventory:
 *   get:
 *     tags: [Inventory]
 *     summary: Current pharmacy's inventory
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Inventory list }
 *   post:
 *     tags: [Inventory]
 *     summary: Add a medicine to stock
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Stock added }
 */
router.get('/', inventory.getMyInventory)
router.get('/stats', inventory.getStats)
router.post('/', addStockRules, validate, inventory.addStock)

/**
 * @openapi
 * /inventory/{id}:
 *   patch:
 *     tags: [Inventory]
 *     summary: Update stock quantity/price
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Stock updated }
 */
router.patch('/:id', mongoId(), updateStockRules, validate, inventory.updateStock)
router.delete('/:id', mongoId(), validate, inventory.removeStock)

export default router
