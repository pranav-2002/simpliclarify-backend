'use strict'

import Express from 'express'
import { expressUtils } from '../helpers'
import { AuthController } from '../controllers'

const AuthRouter = new Express.Router()
const { login, signUp, verifyUser, forgotPassword, googleLogin } = AuthController
const { reqHandler, resHandler } = expressUtils
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler
const { setHeaders } = resHandler

AuthRouter.use(extractHeaders)
AuthRouter.post('/user-signup', routeSanity, asyncWrapper(signUp))
AuthRouter.post('/user-login', routeSanity, asyncWrapper(login))
AuthRouter.post('/user-google-login', routeSanity, asyncWrapper(googleLogin))
AuthRouter.post('/user-verify/:verifyHash', routeSanity, asyncWrapper(verifyUser))
AuthRouter.post('/forgot-password', routeSanity, asyncWrapper(forgotPassword))
AuthRouter.use(setHeaders)

export default AuthRouter
