'use strict'

import { CustomError } from '../helpers'
import User from '../schemas/User'
import Feedback from '../schemas/Feedback'
import Booking from '../schemas/Booking'

const UserModel = {
  getAllUsersAdmin,
  getIndividualUserAdmin,
  giveFeedback
}

export default UserModel

async function getAllUsersAdmin () {
  try {
    const response = await User.find({}).select()
    return response
  } catch (error) {
    throw new CustomError(error)
  }
}

async function getIndividualUserAdmin (body) {
  try {
    const { userId } = body
    const response = await User.find({ _id: userId }).select()
    return response
  } catch (error) {
    throw new CustomError(error)
  }
}

async function giveFeedback (body) {
  try {
    const { bookingId, scRating, mentorRating, comments } = body
    const booking = await Booking.findOne({ _id: bookingId })
    if (!booking) {
      throw new CustomError({ message: 'Invalid Booking ID provided' })
    }
    const feedback = await Feedback.findOne({ bookingId })
    if (feedback) {
      throw new CustomError({ message: 'Feedback already given for the booking' })
    }
    const newFeedback = new Feedback({
      bookingId,
      scRating,
      mentorRating,
      comments
    })
    await newFeedback.save()
    return 'Thank you for your feedback'
  } catch (error) {
    throw new CustomError(error)
  }
}
