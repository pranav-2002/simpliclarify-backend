'use strict'

import { ResponseBody } from '../helpers'
import { ProfileModel } from '../models'

const ProfileController = {
  getProfileDetails,
  updateProfileDetails,
  updatePassword,
  getWalletDetails
}

export default ProfileController

async function getProfileDetails (request, response, next) {
  const data = await ProfileModel.getProfileDetails(request.params)
  const responseBody = new ResponseBody(201, 'Get profile details', data)
  response.body = responseBody
  next()
}

async function updateProfileDetails (request, response, next) {
  const { body } = request
  const data = await ProfileModel.updateProfileDetails(body)
  const responseBody = new ResponseBody(
    200,
    'Profile details updated successfully',
    data
  )
  response.body = responseBody
  next()
}

async function updatePassword (request, response, next) {
  const { body } = request
  const data = await ProfileModel.updatePassword(body)
  const responseBody = new ResponseBody(
    200,
    'Password updated successfully',
    data
  )
  response.body = responseBody
  next()
}

async function getWalletDetails (request, response, next) {
  const { body } = request
  const data = await ProfileModel.getWallet(body)
  const responseBody = new ResponseBody(201, 'Got Wallet Details', data)
  response.body = responseBody
  next()
}
