'use strict'

import Express from 'express'

import { ContactController } from '../controllers'

import { expressUtils } from '../helpers'

const ContactRouter = new Express.Router()
const { createQuery, getAllQueriesAdmin } = ContactController
const { reqHandler, resHandler } = expressUtils
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler
const { setHeaders } = resHandler

ContactRouter.use(extractHeaders)
ContactRouter.post('/send-query', routeSanity, asyncWrapper(createQuery))
ContactRouter.get(
  '/admin/get-all-queries',
  routeSanity,
  asyncWrapper(getAllQueriesAdmin)
)
ContactRouter.use(setHeaders)

export default ContactRouter
