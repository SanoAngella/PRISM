import mongoose from 'mongoose'
import { RESERVATION_STATUS } from '../utils/constants.js'

const reservationSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    patientName: { type: String, required: true, trim: true },
    patientPhone: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(RESERVATION_STATUS),
      default: RESERVATION_STATUS.PENDING,
    },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 3600 * 1000) },
  },
  { timestamps: true },
)

reservationSchema.virtual('total').get(function total() {
  return this.quantity * this.unitPrice
})

reservationSchema.set('toJSON', { virtuals: true })

export default mongoose.model('Reservation', reservationSchema)
