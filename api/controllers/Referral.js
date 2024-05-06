'use strict'

import { ResponseBody } from '../helpers'
import ReferralModel from '../models/Referral'

const ReferralController = {
  addReferralCode
}

export default ReferralController

async function addReferralCode (request, response, next) {
  const { body } = request
  const data = await ReferralModel.addReferralCode(body)
  const responseBody = new ResponseBody(201, 'Referral code has been created by the admin', data)
  response.body = responseBody
  next()
}
