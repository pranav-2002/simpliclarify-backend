'use strict';
import nodeSchedule from 'node-schedule';
import { sendMail } from '../../email-templates/sendEmailTemplate';
import afterMeetingEmailTemplate from '../../email-templates/afterMeetingEmailTemplate';
import Booking from '../schemas/Booking';
import beforeMeetingEmailTemplate from '../../email-templates/beforeMeetingEmailTemplate';

const cronMethods = {
    cronJobForBooking,
};

export default cronMethods;

const MINUTES_BEFORE_MEETING = 30;
const MINUTES_AFTER_MEETING = 10;

function getDateFromString(date, time, operation) {
    const day = parseInt(date.split('-')[0]);
    const month = parseInt(date.split('-')[1]) - 1;
    const year = parseInt(date.split('-')[2]);

    const hour = parseInt(time.split(':')[0]);
    const minute = parseInt(time.split(':')[1]);

    if (operation === 'before') {
        return new Date(
            year,
            month,
            day,
            hour,
            minute - MINUTES_BEFORE_MEETING
        );
    } else {
        return new Date(year, month, day, hour, minute + MINUTES_AFTER_MEETING);
    }
}

function beforeMeetingJob(
    userName,
    userEmail,
    mentorEmail,
    mentorName,
    meetingLink,
    bookingId,
    date,
    startTime,
    endTime
) {
    return async function () {
        try {
            console.log('[CRON JOB] Before Meeting');
            console.log({
                bookingId,
                userEmail,
                mentorEmail,
                date,
                startTime,
                endTime,
            });
            await sendMail(
                'hello@simpliclarify.com',
                userEmail,
                `SimpliClariFy meeting in ${MINUTES_BEFORE_MEETING} minutes`,
                beforeMeetingEmailTemplate(
                    userName,
                    mentorName,
                    'Mentor',
                    date,
                    startTime,
                    endTime,
                    meetingLink,
                    bookingId
                ),
                []
            );

            await sendMail(
                'hello@simpliclarify.com',
                mentorEmail,
                `SimpliClariFy meeting in ${MINUTES_BEFORE_MEETING} minutes`,
                beforeMeetingEmailTemplate(
                    mentorName,
                    userName,
                    'Mentee',
                    date,
                    startTime,
                    endTime,
                    meetingLink,
                    bookingId
                ),
                []
            );
        } catch (e) {
            console.log(e);
        }
    };
}

function afterMeetingJob(
    userName,
    userEmail,
    mentorName,
    bookingId,
    date,
    startTime,
    endTime
) {
    return async function () {
        try {
            console.log('[CRON JOB] After Meeting');
            console.log({
                bookingId,
                userEmail,
                mentorName,
                date,
                startTime,
                endTime,
            });
            await sendMail(
                'hello@simpliclarify.com',
                userEmail,
                'SimpliClariFy meeting Feedback',
                afterMeetingEmailTemplate(
                    userName,
                    date,
                    startTime,
                    endTime,
                    mentorName,
                    bookingId
                ),
                []
            );
        } catch (e) {
            console.log(e);
        }
    };
}

export async function cronJobForBooking(
    userName,
    userEmail,
    mentorEmail,
    mentorName,
    meetingLink,
    bookingId,
    date,
    startTime,
    endTime
) {
    const beforeDate = getDateFromString(date, startTime, 'before');
    const afterDate = getDateFromString(date, endTime, 'after');
    console.log(`Before: booking ID: ${bookingId}, Date: ${beforeDate}`);
    console.log(`After: booking ID: ${bookingId}, Date: ${afterDate}`);
    nodeSchedule.scheduleJob(
        `Before: ${bookingId}`,
        beforeDate,
        beforeMeetingJob(
            userName,
            userEmail,
            mentorEmail,
            mentorName,
            meetingLink,
            bookingId,
            date,
            startTime,
            endTime
        )
    );
    nodeSchedule.scheduleJob(
        `After: ${bookingId}`,
        afterDate,
        afterMeetingJob(
            userName,
            userEmail,
            mentorName,
            bookingId,
            date,
            startTime,
            endTime
        )
    );
}

async function serverStartUp() {
    // 1. Get all the accept bookings, populate userId and mentorId
    // 2. From the meetingDate string -> convert it to an actual Date object and check if it's valid
    // 3.  Call cronJob function for valid bookings with the required parameters
    const bookings = await Booking.find({
        paymentStatus: 'ACCEPT',
    })
        .populate('userId')
        .populate('mentorId')
        .lean();

    for (let i = 0; i < bookings.length; i++) {
        if (!bookings[i].userId || !bookings[i].mentorId) {
            continue;
        }
        const userName = bookings[i].userId.userName;
        const userEmail = bookings[i].userId.userEmail;
        const mentorEmail = bookings[i].mentorId.email;
        const mentorName = bookings[i].mentorId.mentorName;
        const meetingLink = bookings[i].mentorId.meetLink;
        const bookingId = bookings[i]._id;
        const date = bookings[i].meetingDate;
        const startTime = bookings[i].meetingTimings[0].startTime;
        const endTime =
            bookings[i].meetingTimings[bookings[i].meetingTimings.length - 1]
                .endTime;
        const beforeDate = getDateFromString(date, startTime, 'before');
        const afterDate = getDateFromString(date, endTime, 'after');
        if (beforeDate >= new Date()) {
            console.log(
                `Before: booking ID: ${bookingId}, Date: ${beforeDate}`
            );
            nodeSchedule.scheduleJob(
                `Before: ${bookingId}`,
                beforeDate,
                beforeMeetingJob(
                    userName,
                    userEmail,
                    mentorEmail,
                    mentorName,
                    meetingLink,
                    bookingId,
                    date,
                    startTime,
                    endTime
                )
            );
        }
        if (afterDate >= new Date()) {
            console.log(`After: booking ID: ${bookingId}, Date: ${afterDate}`);
            nodeSchedule.scheduleJob(
                `After: ${bookingId}`,
                afterDate,
                afterMeetingJob(
                    userName,
                    userEmail,
                    mentorName,
                    bookingId,
                    date,
                    startTime,
                    endTime
                )
            );
        }
    }
}

// serverStartUp(); uncomment the following line if you want server to start the cron jobs on startup

// function schedulerTimeCheck() {
//     nodeSchedule.scheduleJob(`SUPPOSED TO RUN AT 17:53`, new Date(2021, 5, 13, 17, 53), function () {
//         console.log('SUPPOSED TO RUN AT 17:53')
//     })

//     nodeSchedule.scheduleJob(`SUPPOSED TO RUN AT 23:23`, new Date(2021, 5, 13, 23, 23), function () {
//         console.log('SUPPOSED TO RUN AT 23:23')
//     })
// }

// schedulerTimeCheck();
