'use strict'
import bcrypt from 'bcryptjs'
import ejs from 'ejs'

import { CustomError } from './expressUtils'
import { sendMail } from '../../email-templates/sendEmailTemplate'
import { cronJobForBooking } from './cronMethods'
import unescapeJs from 'unescape-js'

import MailTemplate from '../schemas/_MailTemplate'

const Methods = {
  applyDiscount,
  bookingMailTemplate,
  comparePasswords
}

export default Methods

function applyDiscount (discountPercentage, amount) {
  const discountedAmount = amount - (amount * (discountPercentage / 100))
  return Math.round((discountedAmount + Number.EPSILON) * 100) / 100
}

async function scheduleEmailsForBooking (user, mentor, booking) {
  const userName = user.userName
  const userEmail = user.userEmail
  const mentorEmail = mentor.email
  const mentorName = mentor.name
  const meetingLink = mentor.meetLink
  const bookingId = booking._id
  const date = booking.meetingDate
  const startTime = booking.meetingTimings[0].startTime
  const endTime = booking.meetingTimings[booking.meetingTimings.length - 1].endTime
  cronJobForBooking(userName, userEmail, mentorEmail, mentorName, meetingLink, bookingId, date, startTime, endTime)
}

async function bookingMailTemplate (user, mentor, foundBooking) {
  try {
    scheduleEmailsForBooking(user, mentor, foundBooking)
    const { meetingTimings, discountedAmount, totalAmount, personaType, meetingDate, _id } = foundBooking
    const { userName } = user
    const { name, meetLink } = mentor

    const timings = _createMeetTiming(meetingTimings)
    const duration = meetingTimings.length * 30
    const price = foundBooking && discountedAmount ? discountedAmount : totalAmount
    const type = personaType.toLowerCase()
    const mentorAmount = mentor[type].mentorCut * meetingTimings.length

    const BccAddresses = ['booking.simpliclarify@gmail.com', 'bookings@simpliclarify.com']
    // let BccAddresses = ["tech.simpliclarify@gmail.com"]

    const renderTemplateObjectUser = {
      templateBody: { templateId: 'TEMPLATE_USER_BOOKING_SUCCESS' },
      locals: {
        userName,
        bookingId: _id,
        mentorName: name,
        price,
        meetingDuration: duration, // duration
        meetingDate: meetingDate,
        timings,
        meetLink
      }
    }
    const renderTemplateObjectMentor = {
      templateBody: { templateId: 'TEMPLATE_MENTOR_BOOKING_SUCCESS' },
      locals: {
        mentorName: name,
        bookingId: _id,
        mentorCut: mentorAmount,
        userName,
        meetingDuration: duration, // duration
        meetingDate: meetingDate,
        timings,
        meetLink
      }
    }
    const renderUserTemplate = await _renderTemplate(renderTemplateObjectUser)
    const renderMentorTemplate = await _renderTemplate(renderTemplateObjectMentor)

    const userTemplateData = await _findTemplate(renderTemplateObjectUser.templateBody)
    const mentorTemplateData = await _findTemplate(renderTemplateObjectMentor.templateBody)

    const userBody = _unescapeString(renderUserTemplate)
    const mentorBody = _unescapeString(renderMentorTemplate)

    const mailSentToUser = await sendMail(userTemplateData.sourceMail, user.userEmail, userTemplateData.subject, userBody, BccAddresses)
    const mailSentToMentor = await sendMail(mentorTemplateData.sourceMail, mentor.email, mentorTemplateData.subject, mentorBody, BccAddresses)
    console.log(mailSentToUser, mailSentToMentor)
    return
  } catch (error) {
    throw new CustomError(error)
  }
}

async function comparePasswords (passwordEntered, hash) {
  const match = await bcrypt.compare(passwordEntered, hash)
  return match
}

function _createMeetTiming (meetingTimings) {
  let timings = ''
  meetingTimings.forEach((time, index) => {
    timings += time.startTime
    timings += '-'
    timings += time.endTime
    if (index !== meetingTimings.length - 1) {
      timings += ', '
    }
  })
  return timings
}

async function _renderTemplate (body) {
  try {
    const { locals, templateBody } = body
    const template = await MailTemplate.findOne(templateBody)
    const { html } = template
    return ejs.render(html, locals)
  } catch (error) {
    throw new CustomError(error)
  }
}

function _unescapeString (body) {
  return unescapeJs(body)
}

async function _findTemplate (body) {
  const template = await MailTemplate.findOne(body)
  const { subject, sourceMail } = template
  return { subject, sourceMail }
}
