'use strict'

import Express from 'express'

import { expressUtils } from '../helpers'
import { BookingController } from '../controllers'

const {
  checkSlotAvailability, bookSlot, bookingSuccess, bookingFailure,
  getAllBookingsAdmin, getBookings, checkScheduledJobs, addNotes
} = BookingController

const { reqHandler, resHandler } = expressUtils
const { extractHeaders, routeSanity, asyncWrapper } = reqHandler
const { setHeaders } = resHandler

const BookingRouter = new Express.Router()

BookingRouter.use(extractHeaders)
BookingRouter.post('/check/availability', routeSanity, asyncWrapper(checkSlotAvailability))
BookingRouter.post('/confirm-slot/payment', routeSanity, asyncWrapper(bookSlot))
BookingRouter.post('/payment/success', routeSanity, asyncWrapper(bookingSuccess))
BookingRouter.post('/payment/failure', routeSanity, asyncWrapper(bookingFailure))
BookingRouter.get('/:userId', routeSanity, asyncWrapper(getBookings))
BookingRouter.get('/admin/get-all-bookings', routeSanity, asyncWrapper(getAllBookingsAdmin))
BookingRouter.post('/dev/check-scheduled-jobs', routeSanity, asyncWrapper(checkScheduledJobs))
BookingRouter.post('/add-notes', routeSanity, asyncWrapper(addNotes))
BookingRouter.use(setHeaders)

export default BookingRouter

/**
booking -> 1. check for slot availability -
           2. block slot
           3. razorpay order
*/
