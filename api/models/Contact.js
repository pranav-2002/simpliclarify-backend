'use strict'
import { CustomError } from '../helpers'
import Contact from '../schemas/Contact'

const ContactModel = {
  createQuery,
  getAllQueriesAdmin
}

export default ContactModel

async function createQuery (body) {
  try {
    console.log(body)
    const queries = new Contact(body)
    const data = await queries.save()
    return data
  } catch (error) {
    throw new CustomError(error)
  }
}

async function getAllQueriesAdmin () {
  try {
    const queries = await Contact.find({}).select()
    return queries
  } catch (error) {
    throw new CustomError(error)
  }
}
