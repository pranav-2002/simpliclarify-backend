'use strict'
import mongoose from 'mongoose'

const userDTRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        course: {
            value: { type: String },
            weight: { type: Number }
        },
        degree: {
            value: { type: String },
            weight: { type: Number }
        },
        university: {
            value: { type: String },
            weight: { type: Number }
        },
        interests: {
            value: { type: [String] },
            weight: { type: Number }
        },
        GRE: {
            value: { type: String },
            weight: { type: Number }
        },
        GMAT: {
            value: { type: String },
            weight: { type: Number }
        },
        TOEFL: {
            value: { type: String },
            weight: { type: Number }
        },
        IELTS: {
            value: { type: String },
            weight: { type: Number }
        },
        CAT: {
            value: { type: String },
            weight: { type: Number }
        },
        GATE: {
            value: { type: String },
            weight: { type: Number }
        },
        patentsPublished: {
            value: { type: String },
            weight: { type: Number }
        },
        papersPublished: {
            value: { type: String },
            weight: { type: Number }
        },
        '10th': {
            value: { type: String },
            weight: { type: Number }
        },
        '12th': {
            value: { type: String },
            weight: { type: Number }
        },
        CGPA: {
            value: { type: String },
            weight: { type: Number }
        },
    },
    { timestamps: { createdAt: 'created_at' } }
)

const UserDTRequest = new mongoose.model('UserDTRequest', userDTRequestSchema)

export default UserDTRequest
