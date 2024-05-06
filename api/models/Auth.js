'use strict';

import crypto from 'crypto';
import generator from 'generate-password';

import { CustomError } from '../helpers';

import User from '../schemas/User';
import Referral from '../schemas/Referral';
import Transaction from '../schemas/Transaction';
import { sendMail } from '../../email-templates/sendEmailTemplate';
import Methods from '../helpers/Methods';
import Constants from '../../config/CONSTANTS';
import signupEmailTemplate from '../../email-templates/signupEmailTemplate';
import verifyUserEmailTemplate from '../../email-templates/verifyUserEmailTemplate';
import forgotPasswordEmailTemplate from '../../email-templates/forgotPasswordEmailTemplate';

const AuthModel = { login, signUp, verifyUser, forgotPassword, googleLogin };

export default AuthModel;

async function dbCallHandler(dbCall, cError) {
    try {
        return await dbCall;
    } catch (error) {
        throw new CustomError(cError);
    }
}

async function googleLogin(body) {
    try {
        const { userName, userEmail, googleToken } = body;
        if (!userEmail || userEmail == '') {
            throw new CustomError('Enter valid email id');
        }
        let user = await User.findOne({ userEmail });
        if (!user) {
            // CREATE A NEW USER
            let userReferralCode = await _generateReferralCode();
            let newUser = new User({
                userName,
                userEmail,
                googleToken,
                wallet: Constants.joiningAmountWithoutReferral,
                userVerify: true,
                isOAuth: true,
                userReferralCode,
            });
            await newUser.save();
            await addTransaction(
                newUser,
                Constants.joiningAmountWithoutReferral,
                'Signup Reward'
            );
            newUser = JSON.parse(JSON.stringify(newUser));
            delete newUser['googleToken'];
            return newUser;
        } else {
            if (!user.isOAuth) {
                throw new CustomError({
                    statusCode: 403,
                    message:
                        'Account with same email id already exists! Try signing in directly / use forgot password',
                });
            }

            if (user.googleToken !== googleToken) {
                throw new CustomError({
                    statusCode: 403,
                    message: 'Invalid google token provided',
                });
            }

            user = JSON.parse(JSON.stringify(user));
            delete user['googleToken'];
            return user;
        }
    } catch (err) {
        throw new CustomError(err);
    }
}

async function signUp(body) {
    const { userEmail, userContactNumber, referralCode } = body;
    const foundUserByMailId = await dbCallHandler(
        User.findOne({ userEmail }),
        'User not found'
    );

    if (foundUserByMailId && foundUserByMailId.userEmail === userEmail) {
        if (foundUserByMailId.userContactNumber === userContactNumber) {
            throw new CustomError({
                statusCode: 403,
                message: 'Account already registered with this contact number',
                code: 'SIMPLICLARIFY_AUTH_04',
            });
        } else {
            throw new CustomError({
                statusCode: 403,
                message: 'Account already registered with this email address',
                code: 'SIMPLICLARIFY_AUTH_04',
            });
        }
    }
    const foundUserByContact = await dbCallHandler(
        User.findOne({ userContactNumber }),
        'User not found'
    );

    if (
        foundUserByContact &&
        foundUserByContact.userContactNumber === userContactNumber
    ) {
        throw new CustomError({
            statusCode: 403,
            message: 'Account already registered with this contact number',
            code: 'SIMPLICLARIFY_AUTH_04',
        });
    }
    const getHash = _generateHash(userEmail);

    try {
        let getReferralCode = await _generateReferralCode();

        Object.assign(body, { verifyHash: getHash });
        Object.assign(body, { userReferralCode: getReferralCode });
        const newUser = new User(body);

        async function verifyReferralCode(referralCode, newUser) {
            if (!referralCode) {
                return;
            }
            const userReferrer = await User.findOne({
                userReferralCode: referralCode,
            });
            if (userReferrer) {
                newUser.referralCodeUsed = referralCode;
                return;
            }

            const adminReferrer = await Referral.findOne({
                code: referralCode,
            });
            if (adminReferrer) {
                if (
                    adminReferrer.currentCount >= adminReferrer.limit ||
                    !adminReferrer.active
                ) {
                    throw new CustomError({
                        statusCode: 401,
                        message:
                            'The Referral Code provided is no longer valid.',
                        code: 'SIMPLICLARIFY_AUTH_05',
                    });
                }
                adminReferrer.currentCount += 1;
                await adminReferrer.save();
                newUser.referralCodeUsed = referralCode;
                return;
            }

            throw new CustomError({
                statusCode: 401,
                message: 'Invalid Referral Code',
                code: 'SIMPLICLARIFY_AUTH_05',
            });
        }
        await verifyReferralCode(referralCode, newUser);
        const endPoint = `https://simpliclarify.com/user-verification/${getHash}`;
        const mailBody = signupEmailTemplate(endPoint, newUser.userName);

        const mailSent = await sendMail(
            'simpliclarify.tech@gmail.com',
            newUser.userEmail,
            'SimpliClariFy Account Verification',
            mailBody
        );
        const createdUser = await newUser.save();
        return createdUser;
    } catch (error) {
        throw new CustomError(error);
    }
}

async function login(body) {
    const { userEmail, userPassword } = body;
    const user = await dbCallHandler(
        User.findOne({ userEmail }),
        'User not found'
    );
    if (user) {
        if (user.isOAuth) {
            throw new CustomError({
                statusCode: 403,
                message: 'Trying signing in through google auth',
            });
        }
        const match = await Methods.comparePasswords(
            userPassword,
            user.userPassword
        );
        if (!match) {
            throw new CustomError({
                statusCode: 403,
                message: 'Invalid Password',
                code: 'SIMPLICLARIFY_AUTH_04',
            });
        } else {
            return user;
        }
    } else {
        throw new CustomError({
            statusCode: 403,
            message: 'Invalid Email Address',
            code: 'SIMPLICLARIFY_AUTH_04',
        });
    }
}

async function verifyUser(body) {
    try {
        const user = await User.findOne(body);
        if (!user) {
            throw new CustomError(
                'Looks like link has expired, please try again'
            );
        }
        if (user.userVerify === true) {
            throw new CustomError(
                'You are already verified. Have a good time!'
            );
        }
        user.userVerify = true;
        if (user.referralCodeUsed) {
            async function addAmountToWallet(user) {
                const referrer = await User.findOne({
                    userReferralCode: user.referralCodeUsed,
                });
                if (referrer) {
                    referrer.referred.push({ userId: user._id });
                    referrer.wallet += Constants.referrerAmount;
                    await addTransaction(
                        referrer,
                        Constants.referrerAmount,
                        'Referral'
                    );
                    await referrer.save();
                    const subject = 'You just got RICHER!!';
                    const body = verifyUserEmailTemplate(
                        Constants.referrerAmount
                    );

                    const mailSent = await sendMail(
                        'hello@simpliclarify.com',
                        referrer.userEmail,
                        subject,
                        body
                    );

                    user.wallet += Constants.referralAmount;
                    await addTransaction(
                        user,
                        Constants.referralAmount,
                        'Referral'
                    );
                    return;
                }

                const adminReferrer = await Referral.findOne({
                    code: user.referralCodeUsed,
                });

                if (adminReferrer) {
                    await addTransaction(user, adminReferrer.value, 'Referral');
                    user.wallet += adminReferrer.value;
                }
            }
            await addAmountToWallet(user);
        } else {
            user.wallet += Constants.joiningAmountWithoutReferral;
            await addTransaction(
                user,
                Constants.joiningAmountWithoutReferral,
                'Signup Reward'
            );
        }
        return await user.save();
    } catch (error) {
        throw new CustomError(error);
    }
}

async function forgotPassword(body) {
    try {
        const user = await User.findOne(body);
        if (!user) {
            throw new CustomError({
                statusCode: 404,
                message: 'User does not exist',
            });
        }

        if (user.isOAuth) {
            throw new CustomError({
                statusCode: 403,
                message:
                    'User cannot reset password. Account logged in through google',
            });
        }
        const subject = 'SimpliClariFy Forgot Password';
        const generatedPassword = _generatePassword(8);
        const mailBody = forgotPasswordEmailTemplate(
            user.userName,
            generatedPassword
        );
        const mailSent = await sendMail(
            'hello@simpliclarify.com',
            user.userEmail,
            subject,
            mailBody
        );
        if (mailSent && mailSent.MessageId) {
            user.userPassword = generatedPassword;
            await user.save();
            return;
        } else {
            throw new CustomError('Mail Notification Failed');
        }
    } catch (error) {
        throw new CustomError(error);
    }
}

function _generateHash(uniqueHash) {
    const hash = crypto
        .createHash('sha256')
        .update(uniqueHash, 'utf-8')
        .digest('hex');
    return hash;
}

function _generatePassword(length) {
    const _generatedPassword = generator.generate({
        length,
        numbers: true,
    });
    return _generatedPassword;
}

async function _generateReferralCode() {
    function getCode() {
        const arr = [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
        ];
        let str = '';
        const array = ['', '', '', '', '', ''].map((i, index) => {
            str += arr[Math.floor(Math.random() * (35 - index + 1))];
        });
        return str;
    }

    // Ensuring the referral code is unique
    let referralCode = null,
        count = 0;
    const RETRY_COUNT = 10;
    while (count++ < RETRY_COUNT) {
        referralCode = getCode();
        let foundSameReferral = await User.findOne({
            referralCode: referralCode,
        });
        if (!foundSameReferral) {
            foundSameReferral = await Referral.findOne({
                code: referralCode,
            });
        }
        if (!foundSameReferral) {
            break;
        }
    }

    if (count === RETRY_COUNT) {
        throw new CustomError({
            statusCode: 403,
            message: 'Unable to generate unique referral code',
        });
    } else {
        return referralCode;
    }
}

async function addTransaction(user, amount, purpose) {
    const transactionBody = {
        userId: user._id,
        amount: amount,
        type: 'Deposit',
        purpose,
    };
    const transaction = new Transaction(transactionBody);
    await transaction.save();
}
