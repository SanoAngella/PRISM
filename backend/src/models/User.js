import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { ROLES } from '../utils/constants.js'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, 'Invalid email address'],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.PATIENT,
    },
    phone: { type: String, trim: true },
    organization: { type: String, trim: true },
    // For pharmacy users, links to the pharmacy they manage.
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// Hash password before saving when modified.
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

// Never leak password hashes through JSON serialization.
userSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.password
    delete ret.__v
    return ret
  },
})

export default mongoose.model('User', userSchema)
