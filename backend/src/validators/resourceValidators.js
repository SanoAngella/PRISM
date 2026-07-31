import { body, param } from 'express-validator'
import { MEDICINE_CATEGORIES } from '../utils/constants.js'

export const mongoId = (name = 'id') =>
  param(name).isMongoId().withMessage('Invalid identifier')

export const medicineRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('category').isIn(MEDICINE_CATEGORIES).withMessage('Invalid category'),
  body('unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
  body('prescriptionRequired').optional().isBoolean(),
]

export const addStockRules = [
  body('medicine').isMongoId().withMessage('Valid medicine id required'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('reorderLevel').optional().isInt({ min: 0 }),
]

export const updateStockRules = [
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be 0 or more'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('reorderLevel').optional().isInt({ min: 0 }),
]

export const reservationRules = [
  body('medicine').isMongoId().withMessage('Valid medicine id required'),
  body('pharmacy').isMongoId().withMessage('Valid pharmacy id required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('patientName').trim().notEmpty().withMessage('Patient name is required'),
  body('patientPhone').trim().notEmpty().withMessage('Patient phone is required'),
]

export const saleRules = [
  body('medicine').isMongoId().withMessage('Valid medicine id required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
]
