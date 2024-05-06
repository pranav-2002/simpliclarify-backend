'use strict'
import mongoose from 'mongoose'

const referralSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: true
    },
    value: {
      type: Number,
      required: true
    },
    currentCount: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      required: true
    },
    createdFor: {
      type: String
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const Referral = new mongoose.model('Referral', referralSchema)
export default Referral
