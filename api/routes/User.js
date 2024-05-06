'use strict'

import Express from 'express'

import { UserController } from '../controllers'

import { expressUtils } from '../helpers'

const UserRouter = new Express.Router()
const { getAllUsersAdmin, getIndividualUserAdmin, giveFeedback } = UserController
const { reqHandler, resHandler } = expressUtils
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler
const { setHeaders } = resHandler

UserRouter.use(extractHeaders)
UserRouter.get(
  '/admin/get-all-users',
  routeSanity,
  asyncWrapper(getAllUsersAdmin)
)
UserRouter.get(
  '/admin/get-individual-user/:userId',
  routeSanity,
  asyncWrapper(getIndividualUserAdmin)
)

UserRouter.post(
  '/givefeedback',
  routeSanity,
  asyncWrapper(giveFeedback)
)

UserRouter.use(setHeaders)

export default UserRouter
