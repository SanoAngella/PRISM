import { Router } from 'express'
import authRoutes from './authRoutes.js'
import medicineRoutes from './medicineRoutes.js'
import pharmacyRoutes from './pharmacyRoutes.js'
import inventoryRoutes from './inventoryRoutes.js'
import reservationRoutes from './reservationRoutes.js'
import saleRoutes from './saleRoutes.js'
import analyticsRoutes from './analyticsRoutes.js'
import alertRoutes from './alertRoutes.js'

const router = Router()

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Health check
 *     responses:
 *       200: { description: Service is up }
 */
router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'PRISM API is healthy', timestamp: new Date().toISOString() })
})

router.use('/auth', authRoutes)
router.use('/medicines', medicineRoutes)
router.use('/pharmacies', pharmacyRoutes)
router.use('/inventory', inventoryRoutes)
router.use('/reservations', reservationRoutes)
router.use('/sales', saleRoutes)
router.use('/analytics', analyticsRoutes)
router.use('/alerts', alertRoutes)

export default router
