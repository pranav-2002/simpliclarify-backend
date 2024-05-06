'use strict'

import mongoose from 'mongoose'

const paymentCheckout = mongoose.Schema({
  razorpayPaymentId: { type: String, required: true },
  razorpayOrderId: { type: String, required: true },
  razorpaySignature: { type: String, required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }
})

const PaymentCheckout = mongoose.model('PaymentCheckout', paymentCheckout)

export default PaymentCheckout
