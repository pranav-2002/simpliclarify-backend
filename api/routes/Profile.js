'use strict'

import Express from 'express'
import { ProfileController } from '../controllers'
import { expressUtils } from '../helpers'

const ProfileRouter = new Express.Router()

const { reqHandler, resHandler } = expressUtils
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler
const { setHeaders } = resHandler

const {
  getProfileDetails,
  updateProfileDetails,
  updatePassword,
  getWalletDetails
} = ProfileController

ProfileRouter.use(extractHeaders)
ProfileRouter.get(
  '/account-details/:userId',
  routeSanity,
  asyncWrapper(getProfileDetails)
)
ProfileRouter.put(
  '/update/account-details',
  routeSanity,
  asyncWrapper(updateProfileDetails)
)
ProfileRouter.put(
  '/update/password',
  routeSanity,
  asyncWrapper(updatePassword)
)
ProfileRouter.post('/get/wallet', routeSanity, asyncWrapper(getWalletDetails))
ProfileRouter.use(setHeaders)

export default ProfileRouter
