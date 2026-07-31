import mongoose from 'mongoose'
import { ALERT_SEVERITY, ALERT_STATUS } from '../utils/constants.js'

const alertSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    district: { type: String, required: true },
    sector: { type: String },
    severity: {
      type: String,
      enum: Object.values(ALERT_SEVERITY),
      default: ALERT_SEVERITY.MODERATE,
    },
    status: {
      type: String,
      enum: Object.values(ALERT_STATUS),
      default: ALERT_STATUS.ACTIVE,
    },
    confidence: { type: Number, min: 0, max: 100, default: 50 },
    signal: { type: String },
    indicators: [{ type: String }],
    affectedPharmacies: { type: Number, default: 0 },
    caseEstimate: { type: Number, default: 0 },
    recommendation: { type: String },
    detectedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.model('Alert', alertSchema)
