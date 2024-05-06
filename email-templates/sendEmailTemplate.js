import aws from 'aws-sdk';
import { CustomError } from '../api/helpers/expressUtils';

// aws.config.update({ region: 'ap-south-1' });

const SES_CONFIG = {
    accessKeyId: 'AKIAUDE2IDGW6QOSWU74',
    secretAccessKey: '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',
    region: 'ap-south-1',
};

export async function sendMail(
    Source,
    recipientEmail,
    subject,
    mailBody,
    BccAddresses
) {
    try {
        const params = {
            Source,
            Destination: {
                ToAddresses: [recipientEmail],
                BccAddresses:
                    BccAddresses && BccAddresses.length > 0 ? BccAddresses : [],
            },
            ReplyToAddresses: [],
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: mailBody,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject,
                },
            },
        };
        const mailSent = new aws.SES(SES_CONFIG).sendEmail(params).promise();
        console.log(mailSent);
        return mailSent;
    } catch (error) {
        throw new CustomError(error);
    }
}
