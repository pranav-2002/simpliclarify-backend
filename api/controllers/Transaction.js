'use strict'

import { ResponseBody } from '../helpers'
import { TransactionModel } from '../models'

const TransactionController = { getAllTransactions, getUserTransaction }

export default TransactionController

async function getAllTransactions (request, response, next) {
  const data = await TransactionModel.getAllTransaction(request.params)
  const responseBody = new ResponseBody(201, 'Got All Transactions', data)
  response.body = responseBody
  next()
}

async function getUserTransaction (request, response, next) {
  const { body } = request
  const data = await TransactionModel.getTransaction(body)
  const responseBody = new ResponseBody(201, 'Got All Transactions', data)
  response.body = responseBody
  next()
}
