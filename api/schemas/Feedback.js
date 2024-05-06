'use strict'
import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  scRating: {
    type: Number,
    required: true
  },
  mentorRating: {
    type: Number,
    required: true
  },
  comments: {
    type: String,
    required: true
  }
}, { timestamps: { createdAt: 'created_at' } })

const Feedback = new mongoose.model('Feedback', feedbackSchema)
export default Feedback
