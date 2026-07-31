import mongoose from 'mongoose'

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    licenseNo: { type: String, required: true, unique: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    district: { type: String, required: true, trim: true },
    sector: { type: String, trim: true },
    address: { type: String, trim: true },
    // GeoJSON point for proximity queries.
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [30.0619, -1.9441] }, // [lng, lat]
    },
    hours: { type: String, default: 'Mon–Sat 08:00–20:00' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    open: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

pharmacySchema.index({ location: '2dsphere' })
pharmacySchema.index({ name: 'text', district: 'text' })

export default mongoose.model('Pharmacy', pharmacySchema)
