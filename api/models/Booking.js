'use strict';

import crypto from 'crypto';
import request from 'request';

import { razorpayInstance } from '../../config/RAZORPAY_CONFIG';
import { CustomError } from '../helpers';
import Constants from '../../config/CONSTANTS';

import Booking from '../schemas/Booking';
import Mentor from '../schemas/_Mentor';
import User from '../schemas/User';
import Transaction from '../schemas/Transaction';

import { bookSchedule, checkAvailability, cancelSchedule } from './Schedule';
import Methods from '../helpers/Methods';
import Promo from '../schemas/Promo';
import PaymentCheckout from '../schemas/PaymentCheckout';
import nodeSchedule from 'node-schedule';

const BookingModel = {
    checkSlotAvailability,
    bookSlot,
    bookingSuccess,
    bookingFailure,
    getBookings,
    getAllBookingsAdmin,
    checkScheduledJobs,
    addNotes,
};

export default BookingModel;

async function checkScheduledJobs(body) {
    try {
        console.log('Inside check scheduled jobs');
        const jobs = nodeSchedule.scheduledJobs;
        let count = 0;
        for (const key in jobs) {
            count++;
            const job = jobs[key];
            console.log(`Inside job ${count}`);
            console.log(`Job Name: ${key}`);
            console.log(job.nextInvocation());
            console.log(`End of job ${count}`);
        }
        return 'Printed the scheduled jobs to the console(stdout)';
    } catch (error) {
        throw new CustomError(error);
    }
}

async function checkSlotAvailability(body) {
    try {
        const isAvailableFlag = await _checkAvailability(body);
        return isAvailableFlag;
    } catch (error) {
        throw new CustomError(error);
    }
}

async function bookSlot(body) {
    try {
        const {
            userId,
            mentorId,
            schedule,
            meetingDate,
            promoId,
            personaType,
            notes,
            walletCoins,
        } = body;

        const findMentor = await Mentor.findOne({ _id: mentorId });
        if (!findMentor) {
            throw new CustomError({
                statusCode: 404,
                message: 'Mentor not found',
            });
        }
        const findUser = await User.findOne({ _id: userId });
        if (!findUser) {
            throw new CustomError({
                statusCode: 401,
                message: 'User not found',
            });
        }
        if (findUser && !findUser.userVerify) {
            throw new CustomError({
                statusCode: 401,
                message:
                    'Please verify your Email Address to proceed for booking',
            });
        }
        let isAvailableFlag = 0;
        let isBookedFlag = 0;
        let unavailableSlotStartTime = '';
        let unavailableSlotEndTime = '';
        const meetingTimings = [];

        for (let i = 0; i < schedule.length; ++i) {
            if (
                !(await checkAvailability(
                    mentorId,
                    meetingDate,
                    schedule[i].startTime
                ))
            ) {
                isAvailableFlag = 1;
                unavailableSlotStartTime = schedule[i].startTime;
                unavailableSlotEndTime = schedule[i].endTime;
                break;
            }
        }
        if (isAvailableFlag) {
            throw new CustomError({
                statusCode: 403,
                message: `The slot ${unavailableSlotStartTime} - ${unavailableSlotEndTime} is not available for booking, please select a different slot timing`,
            });
        }
        const verifyType = _checkType(personaType);
        if (!verifyType) {
            throw new CustomError({
                statusCode: 400,
                message: 'Invalid PersonaType',
            });
        }
        const type = personaType.toLowerCase();
        let amount = findMentor[type].mentorPrice;
        if (promoId) {
            const promo = await Promo.findOne({ _id: promoId });
            const checkPromoValidity = await Booking.find({
                userId: userId,
                promoId: promo._id,
                paymentStatus: 'ACCEPT',
            });
            if (
                checkPromoValidity.length >= promo.countPerUser ||
                !promo.allowedPersonas.includes(personaType) ||
                (promo.allowedMentors.length !== 0 &&
                    !promo.allowedMentors.includes(mentorId))
            ) {
                throw new CustomError({
                    statusCode: 401,
                    message:
                        'Promo code expired. Try entering a valid promo code.',
                });
            }
            amount = Methods.applyDiscount(
                promo.promoDiscountPercentage,
                amount
            );
        }
        for (let j = 0; j < schedule.length; ++j) {
            if (
                !(await bookSchedule(
                    mentorId,
                    meetingDate,
                    schedule[j].startTime
                ))
            ) {
                isBookedFlag = 1;
                unavailableSlotStartTime = schedule[j].startTime;
                unavailableSlotEndTime = schedule[j].endTime;
            } else {
                meetingTimings.push({
                    startTime: schedule[j].startTime,
                    endTime: schedule[j].endTime,
                });
            }
        }

        let walletBefore = findUser.wallet;
        let coinsUsed;
        if (walletCoins) {
            if (amount > walletBefore) {
                coinsUsed = walletBefore;
                amount -= Math.floor(walletBefore);
                walletBefore = 0;
            } else {
                coinsUsed = amount;
                walletBefore -= amount;
                amount = 0;
            }
        }
        if (isBookedFlag) {
            throw new CustomError({
                statusCode: 403,
                message: `The slot ${unavailableSlotStartTime} - ${unavailableSlotEndTime} is already booked, please select a different slot timing`,
            });
        }
        if (amount === 0) {
            const booking = {
                userId,
                mentorId,
                totalAmount: findMentor[type].mentorPrice,
                promoId,
                discountedAmount: amount,
                meetingTimings,
                meetingDate,
                paymentStatus: 'ACCEPT',
                personaType,
                mentorCut: findMentor[type].mentorCut,
            };

            if (walletCoins) {
                // Object.assign(booking, { walletAmount: walletBefore });
                booking.walletAmount = coinsUsed;
            }
            if (notes) {
                booking.notes = notes;
            }
            const bookFreeSlot = new Booking(booking);
            const bookedSlot = await bookFreeSlot.save();
            if (promoId) {
                await _updateOfferCounter(promoId);
            }
            await Methods.bookingMailTemplate(findUser, findMentor, bookedSlot);
            if (walletCoins) {
                const walletAmtDeducted = findUser.wallet - walletBefore;
                findUser.wallet = walletBefore;
                await findUser.save();
                await addTransaction(
                    findUser,
                    walletAmtDeducted,
                    bookedSlot._id,
                    'Withdraw'
                );
                await checkUserFirstBooking(findUser);
            }
            return bookFreeSlot;
        }
        amount = amount * meetingTimings.length;
        const options = {
            amount: Math.floor(amount * 100),
            currency: 'INR',
            receipt: userId,
        };
        const instance = await razorpayInstance();
        const razorpayOrder = await instance.orders.create(options);
        if (!razorpayOrder) {
            throw new CustomError({
                statusCode: 401,
                message: 'Booking failed',
            });
        }
        const obj = {
            userId,
            mentorId,
            totalAmount: findMentor[type].mentorPrice,
            meetingTimings,
            meetingDate,
            razorpayOrderId: razorpayOrder.id,
            personaType,
            mentorCut: findMentor[type].mentorCut,
        };
        if (promoId) {
            Object.assign(obj, { promoId, discountedAmount: amount });
        }
        if (walletCoins) {
            obj.walletAmount = coinsUsed;
        } else {
            obj.walletAmount = 0;
        }
        const booking = new Booking(obj);
        if (notes) {
            booking.notes = notes;
        }
        const data = await booking.save();

        setTimeout(_timedOutBooking, 600000, booking);
        return data;
    } catch (error) {
        console.log('Here', error);
        throw new CustomError(error);
    }
}

async function bookingSuccess(body) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;
    try {
        const foundBooking = await Booking.findOne({ razorpayOrderId });
        if (!foundBooking) {
            throw new CustomError({
                statusCode: 404,
                message: 'Booking failed to create',
            });
        }
        const razorpayKeyId = process.env.KEY_ID || '';
        const razorpaySecret = process.env.KEY_SECRET || '';
        // console.log("%%%%%%%%%%", razorpayKeyId);
        const {
            discountedAmount,
            totalAmount,
            paymentStatus,
            userId,
            mentorId,
            _id,
            walletAmount,
        } = foundBooking;
        const generatedSignature = _generateSignature(
            foundBooking.razorpayOrderId,
            razorpayPaymentId,
            razorpaySecret
        );

        if (generatedSignature !== razorpaySignature) {
            await _updateBooking(_id, 'AUTH_FAILURE');
            throw new CustomError(
                'Booking verification failed, please try again'
            );
        }

        const capturePaymentObject = {
            method: 'POST',
            url: `https://${razorpayKeyId}:${razorpaySecret}@api.razorpay.com/v1/payments/${razorpayPaymentId}/capture`,
            form: {
                amount: discountedAmount || totalAmount,
                currency: 'INR',
            },
        };
        const user = await User.findOne({ _id: userId });
        const mentor = await Mentor.findOne({ _id: mentorId });
        console.log(user);
        // Todo: check if slots are free, if free then capture it else return the error
        if (paymentStatus === 'CANCEL' || paymentStatus === 'REJECT') {
            const checkAvailable = await _checkAvailability(foundBooking);
            if (!checkAvailable) {
                await _updateBooking(
                    foundBooking._id,
                    `${paymentStatus}_RETRY_FAILURE`
                );
                throw new CustomError({
                    statusCode: 403,
                    message:
                        'Your Mentor booking has failed, Any deductions from bank account will be credited in 5-7 working days',
                });
            }
            const bookedSlots = await _bookSlots(foundBooking);
            if (!bookedSlots) {
                await _updateBooking(_id, `${paymentStatus}_RETRY_FAILURE`);
                throw new CustomError({
                    statusCode: 403,
                    message:
                        'Your Mentor booking has failed, Any deductions from bank account will be credited in 5-7 working days',
                });
            }
            _capturePaymentCallback(
                capturePaymentObject,
                async function (response) {
                    const obj = {
                        razorpayPaymentId,
                        razorpayOrderId,
                        razorpaySignature,
                        bookingId: _id,
                        userId: userId,
                    };
                    const paymentCheckout = new PaymentCheckout(obj);
                    await paymentCheckout.save();
                    await _updateBooking(_id, 'ACCEPT');
                    if (foundBooking.promoId) {
                        await _updateOfferCounter(foundBooking.promoId);
                    }
                    await Methods.bookingMailTemplate(
                        user,
                        mentor,
                        foundBooking
                    );
                    const walletAmtDeducted = user.wallet - walletAmount;
                    user.wallet = walletAmtDeducted;
                    await user.save();
                    if (walletAmount !== 0) {
                        await addTransaction(
                            user,
                            walletAmount,
                            _id,
                            'Withdraw'
                        );
                    }
                    await checkUserFirstBooking(user);
                }
            );
        } else if (paymentStatus === 'PENDING') {
            _capturePaymentCallback(
                capturePaymentObject,
                async function (response) {
                    console.log(response);
                    const obj = {
                        razorpayPaymentId,
                        razorpayOrderId,
                        razorpaySignature,
                        bookingId: _id,
                        userId: userId,
                    };
                    const paymentCheckout = new PaymentCheckout(obj);
                    await paymentCheckout.save();
                    await _updateBooking(_id, 'ACCEPT');
                    if (foundBooking.promoId) {
                        await _updateOfferCounter(foundBooking.promoId);
                    }
                    await Methods.bookingMailTemplate(
                        user,
                        mentor,
                        foundBooking
                    ); // change
                    const walletAmtDeducted = user.wallet - walletAmount;
                    user.wallet = walletAmtDeducted;
                    await user.save();
                    if (walletAmount !== 0) {
                        await addTransaction(
                            user,
                            walletAmount,
                            _id,
                            'Withdraw'
                        );
                    }
                    await checkUserFirstBooking(user);
                }
            );
        } else {
            console.log('INVALID PAYMENT TYPE USER NOT ALLOWED TO BOOK');
            await _updateBooking(foundBooking._id, 'REJECT');
            throw new CustomError({
                statusCode: 403,
                message:
                    'Your Mentor booking has failed, Any deductions from bank account will be credited in 5-7 working days',
            });
        }
    } catch (error) {
        throw new CustomError(error);
    }
}

async function bookingFailure(body) {
    try {
        const { razorpayOrderId } = body;
        const foundBooking = await Booking.findOne({ razorpayOrderId });
        if (foundBooking) {
            // Free slots update booking status
            const { mentorId, meetingDate, meetingTimings, _id } = foundBooking;
            await _cancelSchedule(mentorId, meetingDate, meetingTimings);
            await _updateBooking(_id, 'CANCEL');
            return;
        } else {
            throw new CustomError('Booking not available');
        }
    } catch (error) {
        throw new CustomError(error);
    }
}

async function getBookings(body) {
    try {
        const { userId } = body;
        const bookings = await Booking.find({
            userId,
            paymentStatus: 'ACCEPT',
        }).populate('mentorId', 'name');
        return bookings;
    } catch (error) {
        throw new CustomError(error);
    }
}

async function _checkAvailability(booking) {
    const { mentorId, meetingTimings, meetingDate } = booking;
    let continueBooking = true;
    for (let j = 0; j < meetingTimings.length; j++) {
        if (
            await checkAvailability(
                mentorId,
                meetingDate,
                meetingTimings[j].startTime
            )
        ) {
            continue;
        } else {
            continueBooking = false;
            break;
        }
    }
    return continueBooking;
}

async function _bookSlots(booking) {
    const { mentorId, meetingTimings, meetingDate } = booking;
    let booked = true;
    for (let j = 0; j < meetingTimings.length; ++j) {
        if (
            !(await bookSchedule(
                mentorId,
                meetingDate,
                meetingTimings[j].startTime
            ))
        ) {
            booked = false;
            break;
        }
    }
    return booked;
}

async function _capturePaymentCallback(capturePaymentObject, cb) {
    request(capturePaymentObject, async function (error, response, body) {
        return cb({ body });
    });
}

async function _updateBooking(bookingId, paymentStatus) {
    const updatedBooking = await Booking.findOneAndUpdate(
        { _id: bookingId },
        { $set: { paymentStatus } },
        { new: true }
    );
    if (updatedBooking) {
        return true;
    } else return false;
}

async function _cancelSchedule(mentorId, meetingDate, meetingTimings) {
    let cancelledSlots = true;
    for (let i = 0; i < meetingTimings.length; i++) {
        if (
            await cancelSchedule(
                mentorId,
                meetingDate,
                meetingTimings[i].startTime
            )
        ) {
            continue;
        } else {
            cancelledSlots = false;
            break;
        }
    }
    return cancelledSlots;
}

async function _updateOfferCounter(promoId) {
    const promo = await Promo.findOne({ _id: promoId });
    promo.currentCount = promo.currentCount + 1;
    await promo.save();
}

async function _timedOutBooking(bookingData) {
    const { _id } = bookingData;
    const booking = await Booking.findOne({ _id });
    const { mentorId, meetingDate, meetingTimings, paymentStatus } = booking;
    if (paymentStatus === 'PENDING') {
        const updateBookingStatus = await _updateBooking(_id, 'REJECT');
        console.log('UPDATED BOOKING STATUS', updateBookingStatus);
        const cancelledSlots = await _cancelSchedule(
            mentorId,
            meetingDate,
            meetingTimings
        );
        console.log('SLOTS FREED', cancelledSlots);
    }
}

async function getAllBookingsAdmin() {
    try {
        const response = await Booking.find({}).select();
        return response;
    } catch (error) {
        throw new CustomError(error);
    }
}

async function addNotes(body) {
    try {
        const { bookingId, notes } = body;
        const booking = await Booking.findOne({ _id: bookingId });
        if (!booking) {
            throw new CustomError('Invalid booking id');
        }
        booking.notes = notes;
        await booking.save();
        return 'Added the notes';
    } catch (error) {
        throw new CustomError(error);
    }
}

function _checkType(personaType) {
    const personaTypes = ['MASTERS', 'JOB', 'ENTREPRENEURSHIP', 'K12'];
    return personaTypes.includes(personaType);
}

function _generateSignature(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySecret
) {
    const hmac = crypto.createHmac('sha256', razorpaySecret);
    hmac.update(razorpayOrderId + '|' + razorpayPaymentId);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature;
}

async function checkUserFirstBooking(user) {
    // To check if its users first booking, if yes, then crediting referrer x wallet coins
    try {
        const firstBooking = await Booking.find({
            userId: user._id,
            paymentStatus: 'ACCEPT',
        });
        if (firstBooking && firstBooking.length === 1) {
            const foundReferrer = await User.findOne({
                userReferralCode: user.referralCodeUsed,
            });
            if (foundReferrer) {
                foundReferrer.wallet += Constants.firstBookingAmount;
                await foundReferrer.save();
                await addTransaction(
                    foundReferrer,
                    Constants.firstBookingAmount,
                    firstBooking._id,
                    'Deposit'
                );
            }
        }
        return;
    } catch (error) {
        throw new CustomError(error);
    }
}

async function addTransaction(user, wallet, bookingId, type) {
    try {
        const transactionBody = {
            userId: user._id,
            amount: wallet,
            purpose: 'Booking',
            type: type,
            bookingId: bookingId,
        };
        const transaction = new Transaction(transactionBody);
        await transaction.save();
        return;
    } catch (error) {
        throw new CustomError(error);
    }
}
