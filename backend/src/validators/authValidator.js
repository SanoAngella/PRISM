import { body } from 'express-validator'

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().trim(),
]

export const registerPharmacyRules = [
  body('pharmacyName').trim().notEmpty().withMessage('Pharmacy name is required'),
  body('licenseNo').trim().notEmpty().withMessage('License number is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('district').trim().notEmpty().withMessage('District is required'),
]

export const loginRules = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]
