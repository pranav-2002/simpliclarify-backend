import { ResponseBody } from '../helpers'
import BookingModel from '../models/Booking'

const BookingController = {
  checkSlotAvailability,
  bookSlot,
  bookingSuccess,
  bookingFailure,
  getBookings,
  getAllBookingsAdmin,
  checkScheduledJobs,
  addNotes
}

export default BookingController

async function checkSlotAvailability (request, response, next) {
  const { body } = request
  const data = await BookingModel.checkSlotAvailability(body)
  const responseBody = new ResponseBody(200, 'Slot availability', data)
  response.body = responseBody
  next()
}

async function bookSlot (request, response, next) {
  const { body } = request
  const data = await BookingModel.bookSlot(body)
  const responseBody = new ResponseBody(201, 'Booking complete', data)
  response.body = responseBody
  next()
}

async function bookingSuccess (request, response, next) {
  const { body } = request
  const data = await BookingModel.bookingSuccess(body)
  const responseBody = new ResponseBody(200, 'Booking successful', data)
  response.body = responseBody
  next()
}

async function bookingFailure (request, response, next) {
  const { body } = request
  const data = await BookingModel.bookingFailure(body)
  const responseBody = new ResponseBody(200, 'Booking Failed', data)
  response.body = responseBody
  next()
}

async function getBookings (request, response, next) {
  const { params } = request
  const data = await BookingModel.getBookings(params)
  const responseBody = new ResponseBody(200, 'Fetched all Bookings', data)
  response.body = responseBody
  next()
}

async function getAllBookingsAdmin (request, response, next) {
  const { body } = request
  const data = await BookingModel.getAllBookingsAdmin(body)
  const responseBody = new ResponseBody(201, 'Fetched all bookings', data)
  response.body = responseBody
  next()
}

async function checkScheduledJobs (request, response, next) {
  const { body } = request
  const data = await BookingModel.checkScheduledJobs(body)
  const responseBody = new ResponseBody(201, 'Fetched all scheduled jobs', data)
  response.body = responseBody
  next()
}

async function addNotes (request, response, next) {
  const { body } = request
  const data = await BookingModel.addNotes(body)
  const responseBody = new ResponseBody(201, 'Successfully added the notes for mentor', data)
  response.body = responseBody
  next()
}
