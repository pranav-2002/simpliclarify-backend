'use strict'

import crypto from 'crypto'
import request from 'request'

import { CustomError } from '../helpers'
import User from '../schemas/User'
import { razorpayInstance } from '../../config/RAZORPAY_CONFIG'
import Transaction from '../schemas/Transaction'
import PaymentCheckout from '../schemas/PaymentCheckout'

const BuyCoinsModel = {
  buyCoins,
  paymentSuccess
}
export default BuyCoinsModel

const paymentTypes = ['CANCEL', 'REJECT', 'PENDING']

async function buyCoins (body) {
  try {
    const { userId, amount } = body

    const user = await User.findOne({ _id: userId })
    if (!user) {
      throw new CustomError({ statusCode: 404, message: 'User not available' })
    }

    if (!user.userVerify) {
      throw new CustomError({ statusCode: 405, message: 'Please verify your Email to  buy Clarity Coins' })
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: userId
    }

    const instance = await razorpayInstance()
    const razorpayOrder = await instance.orders.create(options)

    if (!razorpayOrder) {
      throw new CustomError({ statusCode: 401, message: 'Booking failed' })
    }
    const { id } = razorpayOrder
    const clarityCoins = _creditCoins(amount)
    await _addTransaction(razorpayOrder, userId, clarityCoins, 'PENDING')

    return { amount, razorpayOrderId: id }
  } catch (error) {
    throw new CustomError(error)
  }
}
async function paymentSuccess (body) {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body
  try {
    const transaction = await Transaction.findOne({ razorpayOrderId })

    if (!transaction) {
      throw new CustomError({ statusCode: 404, message: 'Transaction Not Found' })
    }
    const { amount, paymentStatus, userId, _id } = transaction

    const razorpayKeyId = process.env.KEY_ID || ''
    const razorpaySecret = process.env.KEY_SECRET || ''

    const generatedSignature = _generateSignature(transaction.razorpayOrderId, razorpayPaymentId, razorpaySecret)

    if (generatedSignature !== razorpaySignature) {
      await _updateTransaction(_id, 'AUTH_FAILURE')
      throw new CustomError('Transaction verification failed, please try again')
    }

    if (!paymentTypes.includes(paymentStatus)) {
      throw new CustomError('Not allowed to make payment')
    }
    
    const getAmountValue = _getAmountFromCoins(amount)
    
    const currency = 'INR'
    const capturePaymentObject = {
      method: 'POST',
      url: `https://${razorpayKeyId}:${razorpaySecret}@api.razorpay.com/v1/payments/${razorpayPaymentId}/capture`,
      form: {
        amount: getAmountValue,
        currency
      }
    }

    request(capturePaymentObject, function (error, response, body) {
      // console.log(error)
      // console.log(response)
      console.log(body)
    })

    const obj = {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      userId,
      transactionId: _id
    }
    const paymentCheckout = new PaymentCheckout(obj)
    await paymentCheckout.save()
    await _updateTransaction(_id, 'ACCEPT')
    await _updateWallet(userId, amount)
    return
  } catch (error) {
    throw new CustomError(error)
  }
}

async function _updateTransaction (transactionId, paymentStatus) {
  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: transactionId },
    { $set: { paymentStatus } },
    { new: true }
  )
  if (updatedTransaction) {
    return true
  } else return false
}

function _creditCoins(amount) {
  let clarityCoins = 0
  if (amount === 250) {
    clarityCoins += 300;
  } 
  else if (amount === 500) {
    clarityCoins += 700;
  } 
  else if (amount === 700) {
    clarityCoins += 1200;
  }
  return clarityCoins
}

function _getAmountFromCoins(clarityCoins) {
  let amount = 0
  if (clarityCoins === 300) {
    amount = 250
  } 
  else if (clarityCoins === 700) {
    amount = 500
  } 
  else if (clarityCoins === 1200) {
    amount = 700
  }
  return amount
}

function _generateSignature (razorpayOrderId, razorpayPaymentId, razorpaySecret) {
  const hmac = crypto.createHmac('sha256', razorpaySecret)
  hmac.update(razorpayOrderId + '|' + razorpayPaymentId)
  const generatedSignature = hmac.digest('hex')
  return generatedSignature
}

async function _addTransaction (razorpayOrder, userId, amount, paymentStatus) {
  const { id = '' } = razorpayOrder
  const transaction = {
    userId,
    amount,
    purpose: 'Purchased Clarity Coins',
    type: 'Purchase',
    razorpayOrderId: id,
    paymentStatus
  }
  const transactions = new Transaction(transaction)
  const response = await transactions.save()
  return response
}

async function _updateWallet (userId, amount) {
  const user = await User.findOne({ _id: userId })
  user.wallet += amount
  return await user.save()
}
