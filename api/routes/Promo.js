'use strict'

import Express from 'express'
import { expressUtils } from '../helpers'

import { PromoController } from '../controllers'

const PromoRouter = new Express.Router()

const { create, get, deletePromo, apply, enableDisablePromo } = PromoController

const { reqHandler, resHandler } = expressUtils
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler
const { setHeaders } = resHandler

PromoRouter.use(extractHeaders)
PromoRouter.post('/create-promo', routeSanity, asyncWrapper(create))
PromoRouter.get('/active/promos', routeSanity, asyncWrapper(get))
PromoRouter.post('/apply', routeSanity, asyncWrapper(apply))
PromoRouter.post('/delete-promo', routeSanity, asyncWrapper(deletePromo))
PromoRouter.post('/enable-disable-promo', routeSanity, asyncWrapper(enableDisablePromo))
PromoRouter.use(setHeaders)
export default PromoRouter
