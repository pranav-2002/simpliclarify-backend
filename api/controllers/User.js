'use strict'

import { ResponseBody } from '../helpers'
import { UserModel } from '../models'

const UserController = {
  getAllUsersAdmin,
  getIndividualUserAdmin,
  giveFeedback
}

export default UserController

async function getAllUsersAdmin (request, response, next) {
  const data = await UserModel.getAllUsersAdmin()
  const responseBody = new ResponseBody(200, 'Fetched Users', data)
  response.body = responseBody
  next()
}

async function getIndividualUserAdmin (request, response, next) {
  const data = await UserModel.getIndividualUserAdmin(request.params)
  const responseBody = new ResponseBody(200, 'Fetched Individual User', data)
  response.body = responseBody
  next()
}

async function giveFeedback (request, response, next) {
  const data = await UserModel.giveFeedback(request.body)
  const responseBody = new ResponseBody(200, 'Feedback given successfully', data)
  response.body = responseBody
  next()
}
