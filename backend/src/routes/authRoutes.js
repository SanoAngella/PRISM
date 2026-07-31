import { Router } from 'express'
import * as auth from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import { registerRules, registerPharmacyRules, loginRules } from '../validators/authValidator.js'

const router = Router()

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication and session management
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a patient account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Aline Uwase }
 *               email: { type: string, example: patient@prism.rw }
 *               password: { type: string, example: password }
 *               phone: { type: string, example: "+250 788 000 000" }
 *     responses:
 *       201: { description: Account created }
 *       409: { description: Email already exists }
 */
router.post('/register', registerRules, validate, auth.register)

/**
 * @openapi
 * /auth/register-pharmacy:
 *   post:
 *     tags: [Auth]
 *     summary: Register a pharmacy and its owner account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pharmacyName, licenseNo, email, password, district]
 *             properties:
 *               pharmacyName: { type: string, example: Kigali Care Pharmacy }
 *               licenseNo: { type: string, example: RW-PHM-2026-0777 }
 *               email: { type: string, example: care@prism.rw }
 *               password: { type: string, example: password }
 *               district: { type: string, example: Gasabo }
 *               sector: { type: string, example: Remera }
 *               address: { type: string, example: KG 11 Ave }
 *               phone: { type: string }
 *     responses:
 *       201: { description: Pharmacy registered }
 */
router.post('/register-pharmacy', registerPharmacyRules, validate, auth.registerPharmacy)

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Sign in and receive a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: pharmacy@prism.rw }
 *               password: { type: string, example: password }
 *     responses:
 *       200: { description: Signed in }
 *       401: { description: Invalid credentials }
 */
router.post('/login', loginRules, validate, auth.login)

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the current authenticated user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Current user }
 *       401: { description: Not authenticated }
 */
router.get('/me', protect, auth.me)

export default router
