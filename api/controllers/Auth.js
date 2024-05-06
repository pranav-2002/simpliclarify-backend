'use strict'

import { ResponseBody } from '../helpers'
import AuthModel from '../models/Auth'

const AuthController = {
    signUp,
    login,
    verifyUser,
    forgotPassword,
    googleLogin
}

export default AuthController

async function signUp(request, response, next) {
    const { body } = request
    const data = await AuthModel.signUp(body)
    const responseBody = new ResponseBody(201, 'User verification mail has been sent to your Mail account', data)
    response.body = responseBody
    next()
}

async function login(request, response, next) {
    const { body } = request
    const data = await AuthModel.login(body)
    const responseBody = new ResponseBody(200, 'User login successful', data)
    response.body = responseBody
    next()
}

async function googleLogin(request, response, next) {
    const { body } = request
    const data = await AuthModel.googleLogin(body)
    const responseBody = new ResponseBody(200, 'Google login successful', data)
    response.body = responseBody
    next()
}

async function verifyUser(request, response, next) {
    const { params } = request
    const data = await AuthModel.verifyUser(params)
    const responseBody = new ResponseBody(200, 'User verification successful', data)
    response.body = responseBody
    next()
}

async function forgotPassword(request, response, next) {
    const { body } = request
    const data = await AuthModel.forgotPassword(body)
    const responseBody = new ResponseBody(200, 'New password has been sent to your registered Email address', data)
    response.body = responseBody
    next()
}
