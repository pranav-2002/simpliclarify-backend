'use strict'
import { CustomError } from '../helpers'
import Methods from '../helpers/Methods'
import User from '../schemas/User'

const ProfileModel = {
  getProfileDetails,
  updateProfileDetails,
  updatePassword,
  getWallet
}

export default ProfileModel

async function getProfileDetails (body) {
  try {
    const { userId } = body
    const profileData = await User.find({ _id: userId }).select(
      'userName userEmail userContactNumber'
    )
    return profileData
  } catch (error) {
    throw new CustomError(error)
  }
}

async function updateProfileDetails (body) {
  try {
    const { newUserName, newUserContactNumber, userId } = body
    const profileData = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          userName: newUserName,
          userContactNumber: newUserContactNumber
        }
      },
      { new: true }
    )
    return profileData
  } catch (error) {
    throw new CustomError(error)
  }
}

async function updatePassword (body) {
  try {
    const { oldPassword, newPassword, userId } = body
    const foundUser = await User.findOne({ _id: userId })
    if (foundUser) {
      const matchPwd = await Methods.comparePasswords(
        oldPassword,
        foundUser.userPassword
      )
      if (matchPwd) {
        foundUser.userPassword = newPassword
        const updatedUser = await foundUser.save()
        return updatedUser
      } else {
        throw new CustomError(
          'Looks like you have entered wrong password, please try again!'
        )
      }
    } else {
      throw new CustomError('User not found')
    }
  } catch (error) {
    throw new CustomError(error)
  }
}

async function getWallet (body) {
  try {
    const { userId } = body
    const foundUser = await User.findOne({ _id: userId }).select(
      'wallet userReferralCode'
    )
    return foundUser
  } catch (error) {
    throw new CustomError(error)
  }
}
