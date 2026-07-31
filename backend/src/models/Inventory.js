import mongoose from 'mongoose'
import { STOCK_STATUS } from '../utils/constants.js'

const inventorySchema = new mongoose.Schema(
  {
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    reorderLevel: { type: Number, default: 40, min: 0 },
    price: { type: Number, required: true, min: 0 },
    batchNo: { type: String, trim: true },
    expiryDate: { type: Date },
    status: {
      type: String,
      enum: Object.values(STOCK_STATUS),
      default: STOCK_STATUS.IN_STOCK,
    },
  },
  { timestamps: true },
)

// One inventory record per (pharmacy, medicine).
inventorySchema.index({ pharmacy: 1, medicine: 1 }, { unique: true })

// Keep status in sync with quantity vs reorder level.
inventorySchema.pre('save', function setStatus(next) {
  if (this.quantity <= 0) this.status = STOCK_STATUS.OUT
  else if (this.quantity <= this.reorderLevel) this.status = STOCK_STATUS.LOW
  else this.status = STOCK_STATUS.IN_STOCK
  next()
})

export default mongoose.model('Inventory', inventorySchema)
