// models/Question.js - FINAL VERIFIED VERSION
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: { type: String, default: '' },
    imageURL: { type: String, default: '' },
    isCorrect: {
        type: Boolean,
        required: true,
        default: false
    }
});

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    questionImageURL: { type: String, default: '' },
    options: [optionSchema],
    explanationText: { type: String, default: '' },
    explanationImageURL: { type: String, default: '' },
    videoURL: { type: String, default: '' },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        required:true,
        trim: true
    },
    exam: {
        type: String,
        required: true,
        enum: ['NIMCET', 'CUET PG', 'JEE']
    },
    year: {
        type: Number
    }
}, { timestamps: true });

questionSchema.index({ subject: 1, exam: 1, year: -1 });

module.exports = mongoose.model('Question', questionSchema);