'use strict'

import { ResponseBody } from '../helpers'
import { HealthModel } from '../models'

const HealthController = {
  get
}

export default HealthController

async function get (request, response, next) {
  const data = await HealthModel.get()
  const responseBody = new ResponseBody(200, 'Health check successful', data)
  response.body = responseBody
  process.nextTick(next)
}
