'use strict'

import Express from 'express'
import { BuyCoinsController } from '../controllers'
import { expressUtils } from '../helpers'

const { buyCoins, paymentSuccess } = BuyCoinsController

const { reqHandler, resHandler } = expressUtils
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler
const { setHeaders } = resHandler

const CoinRouter = new Express.Router()

CoinRouter.use(extractHeaders)
CoinRouter.post('/checkout', routeSanity, asyncWrapper(buyCoins))
CoinRouter.post('/payment', routeSanity, asyncWrapper(paymentSuccess))
CoinRouter.use(setHeaders)

export default CoinRouter
