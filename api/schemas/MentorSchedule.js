'use strict'
import mongoose from 'mongoose'

// This is the actual schedule of the mentor
// This has actual dates (25-04-2021, Not days) which get populated
// based on the schema provided or if theres an addition for that
// particular date
const mentorScheduleSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorType',
    required: true
  },
  // Schedules is an object of actual schedules of the
  // mentor
  // Structure example
  /**
     * {
     *      "25-04-2021": [
     *       {
     *          "startTime": 10:00,
     *          "endTime": 10:30,
     *          "isBooked": true
     *      }
     *      ],
     *      "26-04-2021": [
     *      ],
     *      ....
     * }
     */
  schedules: {
    type: Object,
    requred: true
  }
})

const MentorSchedule = mongoose.model('MentorSchedule', mentorScheduleSchema)

export default MentorSchedule
