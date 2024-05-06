'use strict'

import { ResponseBody } from '../helpers'
import { BuyCoinsModel } from '../models'

const BuyCoinsController = {
  buyCoins,
  paymentSuccess
}

export default BuyCoinsController

async function buyCoins (request, response, next) {
  const { body } = request
  const data = await BuyCoinsModel.buyCoins(body)
  const responseBody = new ResponseBody(201, 'Buying CC coins initiated', data)
  response.body = responseBody
  next()
}

async function paymentSuccess (request, response, next) {
  const { body } = request
  const data = await BuyCoinsModel.paymentSuccess(body)
  const responseBody = new ResponseBody(200, 'Payment successfully completed', data)
  response.body = responseBody
  next()
}
