'use strict'
import mongoose from 'mongoose'

const mailTemplate = mongoose.Schema({
  sourceMail: {
    type: String,
    required: true
  },
  templateId: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  html: {
    type: String,
    required: true
  }
})

const MailTemplate = new mongoose.model('MailTemplate', mailTemplate)
export default MailTemplate
