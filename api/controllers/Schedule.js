'use strict'

import { ResponseBody } from '../helpers'
import ScheduleModel from '../models/Schedule'

const ScheduleController = {
  // setSchemaForMentors,
  getScheduleForMentor
  // updateScheduleForMentor,
  // updateSchemaForMentor
}

export default ScheduleController

// async function setSchemaForMentors(request, response, next) {
//     const { body } = request
//     const data = await ScheduleModel.setSchemaForMentors(body)
//     const responseBody = new ResponseBody(200, 'Schema successfully set for mentor', data)
//     response.body = responseBody
//     next()
// }

async function getScheduleForMentor (request, response, next) {
  const { body } = request
  const data = await ScheduleModel.getSchedule(body)
  const responseBody = new ResponseBody(200, 'Successfully got the schedule for mentor', data)
  response.body = responseBody
  next()
}

// async function updateSchemaForMentor(request, response, next) {
//     const { body } = request
//     const data = await ScheduleModel.updateSchemaForMentor(body)
//     const responseBody = new ResponseBody(200, 'Schema successfully updated for mentor', data)
//     response.body = responseBody
//     next()
// }

// async function updateScheduleForMentor(request, response, next) {
//     const { body } = request
//     const data = await ScheduleModel.updateScheduleForMentor(body)
//     const responseBody = new ResponseBody(200, 'Schedule successfully updated for mentor', data)
//     response.body = responseBody
//     next()
// }
