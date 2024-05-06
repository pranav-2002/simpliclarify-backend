'use strict'
import Razorpay from 'razorpay'

const {
  KEY_ID = '',
  KEY_SECRET = ''
} = process.env

export async function razorpayInstance () {
  const instance = new Razorpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET
  })
  return instance
}
