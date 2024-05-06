import mongoose from 'mongoose'

// This is the schema of the schedule (do not confuse with mongoose schema)
// This refers to the general schedule of the mentor throughout the week(monday to sunday)
const mentorScheduleSchemaSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorType',
    required: true
  },
  // Schedules is an array of objects with each index of the array
  // representing a day of the week
  // 0 -> Sunday, 1 -> Monday, .. 6 -> Saturday
  schedules: {
    type: [Object],
    required: true
  }
})

const MentorScheduleSchema = mongoose.model('MentorScheduleSchema', mentorScheduleSchemaSchema)

export default MentorScheduleSchema
