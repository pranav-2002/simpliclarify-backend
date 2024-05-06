'use strict'
import mongoose from 'mongoose'

const promoSchema = new mongoose.Schema(
  {
    promoCreatedBy: {
      type: String,
      required: true
    },
    promoCode: {
      type: String,
      required: true
    },
    promoActive: {
      type: Boolean,
      default: true
    },
    promoDiscountPercentage: {
      type: Number,
      required: true
    },
    currentCount: {
      type: Number,
      default: 0
    },
    promoLimit: {
      type: Number,
      required: true
    },
    countPerUser: {
      type: Number,
      required: true
    },
    allowedPersonas: {
      type: [String],
      validate: (v) => Array.isArray(v) && v.length > 0
    },
    allowedMentors: {
      type: [String],
      validate: (v) => Array.isArray(v)
    }
  },
  { timestamps: { createdAt: 'created_at' } }
)

const Promo = new mongoose.model('Promo', promoSchema)
export default Promo
