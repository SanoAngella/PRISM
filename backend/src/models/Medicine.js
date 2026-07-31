import mongoose from 'mongoose'
import { MEDICINE_CATEGORIES } from '../utils/constants.js'

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    genericName: { type: String, trim: true },
    category: { type: String, enum: MEDICINE_CATEGORIES, required: true },
    form: { type: String, default: 'Tablet' },
    strength: { type: String, trim: true },
    manufacturer: { type: String, trim: true },
    prescriptionRequired: { type: Boolean, default: false },
    unitPrice: { type: Number, required: true, min: 0 },
    packSize: { type: String, trim: true },
    description: { type: String, trim: true },
    // Whether this medicine is a tracer for outbreak detection.
    tracerFor: { type: String, default: null }, // e.g. 'cholera', 'malaria'
  },
  { timestamps: true },
)

medicineSchema.index({ name: 'text', genericName: 'text', category: 'text' })

export default mongoose.model('Medicine', medicineSchema)
