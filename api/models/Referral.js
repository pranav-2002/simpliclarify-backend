'use strict'

import crypto from 'crypto'
import generator from 'generate-password'

import { CustomError } from '../helpers'

import User from '../schemas/User'
import Referral from '../schemas/Referral'

const ReferralModel = { addReferralCode }

export default ReferralModel

async function addReferralCode (body) {
  const { active, code, value, limit, createdFor } = body

  console.log(code)
  const referralExists = await Referral.findOne({ code })
  console.log(referralExists)

  if (referralExists) {
    throw new CustomError('Referral code already exists. Try a new code')
  }

  const userReferralExists = await User.findOne({
    userReferralCode: code
  })
  if (userReferralExists) {
    throw new CustomError('Referral code already exists for user. Try a new code')
  }

  const referral = new Referral({
    active,
    code,
    value,
    limit,
    createdFor
  })

  await referral.save()
  return 'Succesfully saved the referral code'
}
