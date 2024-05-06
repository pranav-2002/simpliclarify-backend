'use strict'

import Express from 'express'
import { expressUtils } from '../helpers'
import { ScheduleController } from '../controllers'

const ScheduleRouter = new Express.Router()
const {
  // setSchemaForMentors, updateSchemaForMentor, updateScheduleForMentor,
  getScheduleForMentor
} = ScheduleController
const { reqHandler, resHandler } = expressUtils
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler
const { setHeaders } = resHandler

ScheduleRouter.use(extractHeaders)
// ScheduleRouter.post('/set-schema', routeSanity, asyncWrapper(setSchemaForMentors))
// ScheduleRouter.post('/update-schema', routeSanity, asyncWrapper(updateSchemaForMentor))
ScheduleRouter.post('/get-schedule', routeSanity, asyncWrapper(getScheduleForMentor))
// ScheduleRouter.post('/update-schedule', routeSanity, asyncWrapper(updateScheduleForMentor))
ScheduleRouter.use(setHeaders)

export default ScheduleRouter
