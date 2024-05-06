import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const mentorSchema = mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  languages: [{ type: String }],
  countryCode: { type: String, required: true },
  contactNumber: { type: String, required: true },
  linkedInUrl: { type: String },
  tenthPercentage: { type: Number },
  twelfthPercentage: { type: Number },
  certifications: {
    GRE: { type: Number },
    GMAT: { type: Number },
    TOEFL: { type: Number },
    IELTS: { type: Number },
    CAT: { type: Number },
    GATE: { type: Number }
  },
  papersPublished: { type: Number },
  patentsPublished: { type: Number },
  educationInformation: [
    {
      universityName: { type: String },
      universityLogo: { type: String },
      country: { type: String },
      degreeType: { type: String },
      city: { type: String },
      courseSpecialization: { type: String },
      startYear: { type: String },
      endYear: { type: String },
      studentType: { type: String },
      course: { type: String },
      cgpa: { type: Number },
      educationLevel: { type: String } // Example, 11-12th, Undergrad, Postgrad 
    }
  ],
  schoolEducationInformation: [
    {
      country: { type: String },
      city: { type: String },
      name: { type: String },
      passOutYear: { type: String },
      board: { type: String },
      stream: { type: String },
      logo: { type: String },
      educationLevel: { type: String } // Example, 11-12th, Undergrad, Postgrad
    }
  ],
  meetLink: { type: String },
  workExperience: [{
    companyName: { type: String },
    companyLogo: { type: String },
    designation: { type: String },
    startYear: { type: String },
    startMonth: { type: String },
    endYear: { type: String, default: 'Current' },
    endMonth: { type: String, default: 'Current' },
    city: { type: String },
    country: { type: String },
    workExperienceType: { type: String }
  }],
  masters: {
    offerings: { type: [String], default: undefined },
    suggestedHourlyPrice: { type: String },
    rank: { type: Number },
    requested: { type: Boolean },
    accepted: { type: Boolean },
    introduction: { type: String },
    ranking: { type: Number },
    mentorPrice: { type: String },
    mentorCut: { type: String }
  },
  job: {
    offerings: { type: [String], default: undefined },
    modeOfPlacement: { type: String },
    suggestedHourlyPrice: { type: String },
    gitHubLink: { type: String },
    requested: { type: Boolean },
    accepted: { type: Boolean },
    introduction: { type: String },
    ranking: { type: Number },
    mentorPrice: { type: String },
    mentorCut: { type: String }
  },
  entrepreneurship: {
    offerings: { type: [String], default: undefined },
    entrepreneurType: { type: String },
    link: { type: String },
    requested: { type: Boolean },
    accepted: { type: Boolean },
    introduction: { type: String },
    suggestedHourlyPrice: { type: String },
    ranking: { type: Number },
    mentorPrice: { type: String },
    mentorCut: { type: String }
  },
  k12: {
    offerings: { type: [String], default: undefined },
    majors: { type: String },
    requested: { type: Boolean },
    accepted: { type: Boolean },
    introduction: { type: String },
    ranking: { type: Number },
    mentorPrice: { type: String },
    mentorCut: { type: String },
    achievements: [{
      exam: { type: String },
      percentage: { type: String },
      rank: { type: String }
    }]
  },
  status: {
    type: String,
    enum: ['REJECTED', 'SCHEDULE', 'ACCEPTED', 'PENDING', 'BAN'],
    default: 'PENDING'
  },
  suggestions: {
    type: String
  },
  personas: {
    type: [String],
    enum: ['MASTERS', 'JOB', 'ENTREPRENEURSHIP', 'K12']
  },
  interests: {
    type: [String],
  }
}, { timestamps: { createdAt: 'created_at' } })

mentorSchema.pre('save', function (next) {
  const user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError)
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError)
          }
          user.password = hash
          next()
        })
      }
    })
  } else {
    return next()
  }
})

const Mentor = new mongoose.model('MentorType', mentorSchema)

export default Mentor
