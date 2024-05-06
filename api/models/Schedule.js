'use strict'

import { CustomError } from '../helpers'
import MentorSchedule from '../schemas/MentorSchedule'

const ScheduleModel = {
  getSchedule,
  bookSchedule,
  cancelSchedule,
  checkAvailability
}

export default ScheduleModel

function formatDateToString (date) {
  return (date.getDate() < 10 ? '0' : '') + date.getDate() +
        '-' + (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) +
        '-' + date.getFullYear()
}

async function getSchedule (body) {
  const { mentorId } = body
  const schedule = await MentorSchedule.findOne({ mentorId }).lean()
  if (!schedule) {
    throw new CustomError({ message: 'Cannot find schedule for mentor' })
  }
  const result = schedule.schedules
  const current = new Date()
  let formattedDate = formatDateToString(current)
  delete result[formattedDate]
  current.setDate(current.getDate() + 8)

  let count = 8
  while (count-- > 0) {
    formattedDate = formatDateToString(current)
    current.setDate(current.getDate() + 1)
    delete result[formattedDate]
  }

  return result
}

export async function checkAvailability (mentorId, date, startTime) {
  const mentorSchedule = await MentorSchedule.findOne({ mentorId })
  if (!mentorSchedule) {
    // throw new CustomError({ message: "Mentor schedule not found" })
    return false
  }

  const schedule = mentorSchedule.schedules
  if (date in schedule === false) {
    // throw new CustomError({ message: "Date does not exist in mentor\"s schedule" })
    return false
  }

  for (let i = 0; i < schedule[date].length; i++) {
    if (schedule[date][i].startTime === startTime) {
      return schedule[date][i].isAvailable === 1
    }
  }

  // throw new CustomError({ message: "Start time does not exist in mentor\"s schedule" })
  return false
}

export async function bookSchedule (mentorId, date, startTime) {
  const mentorSchedule = await MentorSchedule.findOne({ mentorId })
  if (!mentorSchedule) {
    // throw new CustomError({ message: "Mentor schedule not found" })
    return false
  }

  const schedule = mentorSchedule.schedules
  if (date in schedule === false) {
    // throw new CustomError({ message: "Date does not exist in mentor\"s schedule" })
    return false
  }

  for (let i = 0; i < schedule[date].length; i++) {
    if (schedule[date][i].startTime === startTime) {
      if (schedule[date][i].isAvailable === 0) {
        // throw new CustomError({ message: "Slot is unavailable" })
        return false
      }
      schedule[date][i].isAvailable = 0
      mentorSchedule.markModified('schedules')
      await mentorSchedule.save()
      return true
    }
  }

  // throw new CustomError({ message: "Start time does not exist in mentor\"s schedule" })
  return false
}

export async function cancelSchedule (mentorId, date, startTime) {
  const mentorSchedule = await MentorSchedule.findOne({ mentorId })
  if (!mentorSchedule) {
    // throw new CustomError({ message: "Mentor schedule not found" })
    return false
  }

  const schedule = mentorSchedule.schedules
  if (date in schedule === false) {
    // throw new CustomError({ message: "Date does not exist in mentor\"s schedule" })
    return false
  }

  for (let i = 0; i < schedule[date].length; i++) {
    if (schedule[date][i].startTime === startTime) {
      if (schedule[date][i].isAvailable === 1) {
        // throw new CustomError({ message: "Slot is available" })
        return false
      }
      schedule[date][i].isAvailable = 1
      mentorSchedule.markModified('schedules')
      await mentorSchedule.save()
      return true
    }
  }

  // throw new CustomError({ message: "Start time does not exist in mentor\"s schedule" })
  return false
}

// // TESTING
// async function main() {
//     console.log(await checkAvailability("60bdf301ce569e263c9a5ef9", "20-06-2021", "15:00"))
//     console.log(await bookSchedule("60bdf301ce569e263c9a5ef9", "20-06-2021", "15:00"))
//     console.log(await cancelSchedule("60bdf301ce569e263c9a5ef9", "20-06-2021", "15:00"))
// }

// main()
