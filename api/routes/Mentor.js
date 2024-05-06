'use strict'

import Express from 'express'

import { MentorController } from '../controllers'

import { expressUtils } from '../helpers'

const MentorRouter = new Express.Router()
const {
  getPersonaBasedMentor,
  getIndividualMentor,
  getLimitedMentors,
  getAllMentorsAdmin,
  getIndividualMentorAdmin
} = MentorController
const { reqHandler, resHandler } = expressUtils
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler
const { setHeaders } = resHandler

MentorRouter.use(extractHeaders)
MentorRouter.post('/get-mentors/list', routeSanity, asyncWrapper(getPersonaBasedMentor))
MentorRouter.get('/get-mentor/:mentorId', routeSanity, asyncWrapper(getIndividualMentor))
MentorRouter.get('/get-top-3', routeSanity, asyncWrapper(getLimitedMentors))
MentorRouter.get('/admin/get-all-mentors', routeSanity, asyncWrapper(getAllMentorsAdmin))
MentorRouter.get('/admin/get-individual-mentor/:mentorId', routeSanity, asyncWrapper(getIndividualMentorAdmin))
MentorRouter.use(setHeaders)

export default MentorRouter
