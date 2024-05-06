'use strict'

import Express from 'express'
import { TransactionController } from '../controllers'
import { expressUtils } from '../helpers'

const TransactionRouter = new Express.Router()
const { getAllTransactions, getUserTransaction } = TransactionController

const { reqHandler, resHandler } = expressUtils
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler
const { setHeaders } = resHandler

TransactionRouter.use(extractHeaders)

TransactionRouter.post(
  '/admin/getAll',
  routeSanity,
  asyncWrapper(getAllTransactions)
)
TransactionRouter.post(
  '/user/get',
  routeSanity,
  asyncWrapper(getUserTransaction)
)
TransactionRouter.use(setHeaders)

export default TransactionRouter
