const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    issueDescription: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Resolved', 'Dismissed'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);