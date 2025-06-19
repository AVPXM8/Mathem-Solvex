//It handles the logic for student-reported issues
const Report = require('../models/Report');

// @desc    Create a new report
// @route   POST /api/reports
exports.createReport = async (req, res) => {
    try {
        const { questionId, issueDescription } = req.body;
        if (!questionId || !issueDescription) {
            return res.status(400).json({ message: 'Question ID and description are required.' });
        }
        const newReport = new Report({ questionId, issueDescription });
        await newReport.save();
        res.status(201).json({ message: 'Issue reported successfully. Thank you!' });
    } catch (error) {
        res.status(400).json({ message: 'Error submitting report', error: error.message });
    }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
exports.getReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('questionId', 'questionText exam subject').sort({ createdAt: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Delete a report by its ID
// @route   DELETE /api/reports/:id
// @access  Private (Admin Only)
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        await report.deleteOne();
        res.status(200).json({ message: 'Report removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};