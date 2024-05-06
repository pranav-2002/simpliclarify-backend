'use strict'
import mongoose from 'mongoose'

const contactSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    comments: { type: String, required: true }
  },
  { timestamps: { createdAt: 'created_at' } }
)

const Contact = mongoose.model('Contact', contactSchema)

export default Contact
