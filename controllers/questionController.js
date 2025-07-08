 // controllers/questionController.js - FINAL VERIFIED VERSION
const Question = require('../models/Question');
const cloudinary = require('../config/cloudinary');

// GET ALL QUESTIONS (with filters)
exports.getQuestions = async (req, res) => {
    try {
        const { exam, subject, year, search } = req.query;
        let query = {};
        if (exam) query.exam = exam;
        if (subject) query.subject = subject;
        if (year) query.year = year;
        if (search) query.questionText = { $regex: search, $options: 'i' };
        
        // const questions = await Question.find(query).sort({ createdAt: -1 });
        const questions = await Question.find(query).sort({ subject: 1, topic: 1 });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET A SINGLE QUESTION
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// CREATE A QUESTION
exports.createQuestion = async (req, res) => {
    try {
        const questionData = { ...req.body };
        const parsedOptions = JSON.parse(req.body.options);

        if (req.files) {
            for (const key in req.files) {
                const result = await cloudinary.uploader.upload(req.files[key][0].path);
                if (key === 'questionImage') questionData.questionImageURL = result.secure_url;
                if (key === 'explanationImage') questionData.explanationImageURL = result.secure_url;
                if (key.startsWith('option_')) {
                    const optionIndex = parseInt(key.split('_')[1]);
                    if (parsedOptions[optionIndex]) {
                        parsedOptions[optionIndex].imageURL = result.secure_url;
                    }
                }
            }
        }
        const newQuestion = new Question({ ...questionData, options: parsedOptions });
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(400).json({ message: 'Error creating question', error: error.message });
    }
};

// UPDATE A QUESTION
exports.updateQuestion = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.options) {
            updateData.options = JSON.parse(updateData.options);
        }
        if (req.files) {
            for (const key in req.files) {
                const result = await cloudinary.uploader.upload(req.files[key][0].path);
                if (key === 'questionImage') updateData.questionImageURL = result.secure_url;
                if (key === 'explanationImage') updateData.explanationImageURL = result.secure_url;
                if (key.startsWith('option_')) {
                    const optionIndex = parseInt(key.split('_')[1]);
                    if (updateData.options[optionIndex]) {
                        updateData.options[optionIndex].imageURL = result.secure_url;
                    }
                }
            }
        }
        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedQuestion) return res.status(404).json({ message: 'Question not found' });
        res.status(200).json(updatedQuestion);
    } catch (error) {
        res.status(400).json({ message: 'Error updating question', error: error.message });
    }
};

// DELETE A QUESTION
exports.deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) return res.status(404).json({ message: 'Question not found' });
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

//GET DASHBOARD STATS
exports.getQuestionStats = async (req, res) => {
    try {
        const totalQuestions = await Question.countDocuments();
        const subjects = await Question.distinct('subject', { subject: { $ne: null, $ne: "" } });
        const exams = await Question.distinct('exam', { exam: { $ne: null, $ne: "" } });
        res.status(200).json({
            totalQuestions,
            totalSubjects: subjects.length,
            totalExams: exams.length,
        });
    } catch (error) {
        console.error('Error fetching question stats:', error);
        res.status(500).json({ message: 'Server Error while fetching stats' });
    }
};
 
//  // TEMPORARY TESTING VERSION
// exports.getQuestionStats = async (req, res) => {
//     console.log('--- 📊 [TEST] Sending dummy stats data ---');

//     // We are skipping the database and sending back fake numbers
//     const dummyStats = {
//         totalQuestions: 99,
//         totalSubjects: 8,
//         totalExams: 3,
//     };

//     res.status(200).json(dummyStats);
// };
// @desc    Get all unique filter options for the frontend
// @route   GET /api/questions/filters
exports.getFilterOptions = async (req, res) => {
    try {
        // This finds all unique values for the 'subject' field, ignoring any empty ones
        const subjects = await Question.distinct('subject', { subject: { $ne: null, $ne: "" } });
        
        // This finds all unique values for the 'exam' field
        const exams = await Question.distinct('exam', { exam: { $ne: null, $ne: "" } });
        
        // This finds all unique values for the 'year' field
        const years = await Question.distinct('year', { year: { $ne: null } });

        // Send the lists back to the frontend
        res.status(200).json({
            subjects: subjects.sort(),
            exams: exams.sort(),
            years: years.sort((a, b) => b - a), // Sorts years from newest to oldest
        });
    } catch (error) {
        console.error('Error fetching filter options:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getRelatedQuestions = async (req, res) => {
    try {
        const originalQuestion = await Question.findById(req.params.id);
        if (!originalQuestion) {
            return res.status(404).json({ message: 'Original question not found' });
        }

        // Find other questions with the same TOPIC and EXAM
        const relatedQuestions = await Question.find({
            topic: originalQuestion.topic, // Search by topic
            exam: originalQuestion.exam,
            _id: { $ne: req.params.id } // Exclude the current question
        })
        .limit(5)
        .select('questionText exam subject topic'); // Include topic in the response

        res.status(200).json(relatedQuestions);

    } catch (error) {
        console.error('Error fetching related questions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};