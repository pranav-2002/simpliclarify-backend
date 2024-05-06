import aws from 'aws-sdk'
import { CustomError } from '../api/helpers/expressUtils'

aws.config.update({ region: 'ap-south-1' })

export async function sendMail (Source, recipientEmail, subject, mailBody, BccAddresses) {
  try {
    const params = {
      Source,
      Destination: {
        ToAddresses: [
          recipientEmail
        ],
        BccAddresses: BccAddresses && BccAddresses.length > 0 ? BccAddresses : []
      },
      ReplyToAddresses: [],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: mailBody
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject
        }
      }
    }
    const mailSent = new aws.SES().sendEmail(params).promise()
    return mailSent
  } catch (error) {
    throw new CustomError(error)
  }
}
