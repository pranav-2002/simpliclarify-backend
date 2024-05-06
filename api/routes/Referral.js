'use strict'

import Express from 'express'
import { expressUtils } from '../helpers'
import { ReferralController } from '../controllers'

const ReferralRouter = new Express.Router()
const { addReferralCode } = ReferralController
const { reqHandler, resHandler } = expressUtils
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler
const { setHeaders } = resHandler

ReferralRouter.use(extractHeaders)
ReferralRouter.post('/admin/add-referral', routeSanity, asyncWrapper(addReferralCode))
ReferralRouter.use(setHeaders)

export default ReferralRouter
