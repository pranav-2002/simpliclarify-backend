'use strict'

import { CustomError } from '../helpers'
import Methods from '../helpers/Methods'
import Promo from '../schemas/Promo'
import Booking from '../schemas/Booking'

const PromoModel = {
  create,
  get,
  apply,
  deletePromo,
  enableDisablePromo
}

export default PromoModel

async function create (body) {
  try {
    const { promoCode } = body
    console.log(promoCode)
    const foundPromo = await Promo.findOne({ promoCode })
    console.log('check', foundPromo)
    if (!foundPromo) {
      const promo = new Promo(body)
      const data = await promo.save()
      return data
    } else { throw new CustomError('Offer is already generated with this promoCode') }
  } catch (error) {
    throw new CustomError(error)
  }
}

async function get () {
  try {
    const promos = await Promo.find({})
    return promos
  } catch (error) {
    throw new CustomError(error)
  }
}

async function apply (body) {
  try {
    const { amount, promoCode, userId, personaType, mentorId } = body
    const getPromo = await Promo.findOne({ promoCode })
    if (getPromo.currentCount === getPromo.promoLimit) {
      throw new CustomError({
        statusCode: 404,
        message: 'Invalid Promo Code, Please enter a new code'
      })
    }
    const checkPromoValidity = await Booking.find({
      userId: userId,
      promoId: getPromo._id,
      paymentStatus: 'ACCEPT'
    })

    if (getPromo) {
      if (
        checkPromoValidity.length >= getPromo.countPerUser ||
        !getPromo.allowedPersonas.includes(personaType) ||
        (getPromo.allowedMentors.length !== 0 &&
          !getPromo.allowedMentors.includes(mentorId))
      ) {
        throw new CustomError({
          statusCode: 401,
          message: 'Promo code expired. Try entering a valid promo code.'
        })
      }

      if (!getPromo.promoActive) {
        throw new CustomError(
          'This Promo is no longer available, Please enter a new code'
        )
      } else {
        const updatedPrice = Methods.applyDiscount(
          getPromo.promoDiscountPercentage,
          amount
        )
        console.log(updatedPrice)
        const promos = { ...getPromo._doc, updatedPrice }
        return promos
      }
    } else {
      throw new CustomError('Invalid Promo code,Please try entry a valid code')
    }
  } catch (error) {
    throw new CustomError(error)
  }
}

async function deletePromo (body) {
  try {
    const promos = await Promo.find({ promoCode: body.promoCode }).deleteOne()
    return promos
  } catch (error) {
    throw new CustomError(error)
  }
}

async function enableDisablePromo (body) {
  try {
    const promo = await Promo.findOne({ promoCode: body.promoCode })
    promo.promoActive = !promo.promoActive
    promo.save()
    return promo
  } catch (error) {
    throw new CustomError(error)
  }
}
