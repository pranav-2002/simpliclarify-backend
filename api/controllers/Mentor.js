'use strict'

import { ResponseBody } from '../helpers'
import { MentorModel } from '../models'

const MentorController = {
  getPersonaBasedMentor,
  getIndividualMentor,
  getLimitedMentors,
  getAllMentorsAdmin,
  getIndividualMentorAdmin
}

export default MentorController

async function getPersonaBasedMentor (request, response, next) {
  const { body } = request
  const data = await MentorModel.getPersonaBasedMentor(body)
  const responseBody = new ResponseBody(200, 'Fetched mentors', data)
  response.body = responseBody
  next()
}

async function getIndividualMentor (request, response, next) {
  const data = await MentorModel.getIndividualMentor(request.params)
  const responseBody = new ResponseBody(201, 'Fetched individual mentor', data)
  response.body = responseBody
  next()
}

async function getLimitedMentors (request, response, next) {
  const data = await MentorModel.getLimitedMentors()
  const responseBody = new ResponseBody(201, 'Fetched 3 mentors', data)
  response.body = responseBody
  next()
}

async function getAllMentorsAdmin (request, response, next) {
  const data = await MentorModel.getAllMentorsAdmin()
  const responseBody = new ResponseBody(
    201,
    "Fetched all mentors' information",
    data
  )
  response.body = responseBody
  next()
}

async function getIndividualMentorAdmin (request, response, next) {
  const data = await MentorModel.getIndividualMentorAdmin(request.params)
  const responseBody = new ResponseBody(
    201,
    'Fetched individual mentor for mentor',
    data
  )
  response.body = responseBody
  next()
}
