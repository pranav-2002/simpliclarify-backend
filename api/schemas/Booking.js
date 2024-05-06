'use strict'
import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MentorType',
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    promoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Promo'
    },
    discountedAmount: {
      type: Number
    },
    walletAmount: {
      type: Number
    },
    meetingTimings: [
      {
        startTime: String,
        endTime: String
      }
    ],
    meetingDate: {
      type: String,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: [
        'ACCEPT',
        'REJECT',
        'PENDING',
        'CANCEL',
        'AUTH_FAILURE',
        'CANCEL_RETRY_FAILURE',
        'REJECT_RETRY_FAILURE'
      ],
      default: 'PENDING'
    },
    razorpayOrderId: {
      type: String,
      required: true,
      default: 'FREE_USER'
    },
    personaType: {
      type: String,
      enum: ['MASTERS', 'JOB', 'ENTREPRENEURSHIP', 'K12'],
      required: true
    },
    notes: {
      type: String
    },
    mentorCut: {
      type: Number,
      required: true
    },
    payOuts: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: { createdAt: 'created_at' } }
)

const Booking = new mongoose.model('Booking', bookingSchema)
export default Booking
