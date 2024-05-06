'use strict'

import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  amount: {
    type: Number,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Withdraw', 'Deposit', 'Purchase'],
    required: true
  },
  razorpayOrderId: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['ACCEPT', 'REJECT', 'PENDING', 'CANCEL', 'AUTH_FAILURE', 'NON-PAYMENT'],
    default: 'NON-PAYMENT'
  }
}, {
  timestamps: { createdAt: 'created_at' }
})

const Transaction = new mongoose.model('Transaction', transactionSchema)

export default Transaction
