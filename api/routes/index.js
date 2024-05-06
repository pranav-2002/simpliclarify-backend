'use strict'

import { expressUtils, ResponseBody } from '../helpers'
import AuthRouter from './Auth'
import HealthRouter from './Health'
import MentorRouter from './Mentor'
import ScheduleRouter from './Schedule'
import ProfileRouter from './Profile'
import BookingRouter from './Booking'
import PromoRouter from './Promo'
import UserRouter from './User'
import ContactRouter from './Contact'
import TransactionRouter from './Transactions'
import CoinRouter from './BuyCoins'
import ReferralRouter from './Referral'
import DigitalTwinRouter from './DigitalTwin'

const { resHandler } = expressUtils
const { handleResponse } = resHandler

const Routes = [
  { path: '/health', router: HealthRouter },
  { path: '/auth', router: AuthRouter },
  { path: '/mentor', router: MentorRouter },
  { path: '/schedule', router: ScheduleRouter },
  { path: '/profile', router: ProfileRouter },
  { path: '/booking', router: BookingRouter },
  { path: '/promo', router: PromoRouter },
  { path: '/user', router: UserRouter },
  { path: '/contact', router: ContactRouter },
  { path: '/transaction', router: TransactionRouter },
  { path: '/clarity/coins', router: CoinRouter },
  { path: '/referral', router: ReferralRouter },
  { path: '/digital-twin', router: DigitalTwinRouter }
]

Routes.init = (app) => {
  if (!app || !app.use) {
    console.error(
      '[Error] Route Initialization Failed: app / app.use is undefined '
    )
    return process.exit(1)
  }

  Routes.forEach((route) => app.use(route.path, route.router))

  // Final Route Pipeline
  app.use('*', (request, response, next) => {
    if (!request.isMatched) {
      const { method, originalUrl } = request
      const message = `Cannot ${method} ${originalUrl}`
      const error = new ResponseBody(404, message)
      response.body = error
    }

    return handleResponse(request, response, next)
  })

  // Route Error Handler
  app.use((error, request, response, next) => {
    if (!error) {
      return process.nextTick(next)
    }
    console.warn(`[WARN] middleware ${error}`)
    const { statusCode = 500, message } = error
    let responseBody
    if (error.constructor.name === 'ResponseBody') {
      responseBody = error
    } else {
      responseBody = new ResponseBody(statusCode, message, error)
    }
    response.body = responseBody
    return handleResponse(request, response, next)
  })
}
export default Routes
