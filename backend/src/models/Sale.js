import mongoose from 'mongoose'

const saleSchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    channel: { type: String, enum: ['Walk-in', 'Reservation'], default: 'Walk-in' },
    soldAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

saleSchema.index({ pharmacy: 1, soldAt: -1 })
saleSchema.index({ medicine: 1, soldAt: -1 })

export default mongoose.model('Sale', saleSchema)
