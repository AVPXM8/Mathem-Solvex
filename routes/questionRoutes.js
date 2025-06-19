// This is the final, correct code for routes/questionRoutes.js with the proper route order.

const express = require('express');
const router = express.Router();

const { 
    getQuestions, 
    getQuestionById, 
    createQuestion, 
    updateQuestion, 
    deleteQuestion, 
    getQuestionStats,
    getFilterOptions 
} = require('../controllers/questionController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const imageUploadFields = upload.fields([
    { name: 'questionImage', maxCount: 1 },
    { name: 'explanationImage', maxCount: 1 },
    { name: 'option_0_image', maxCount: 1 },
    { name: 'option_1_image', maxCount: 1 },
    { name: 'option_2_image', maxCount: 1 },
    { name: 'option_3_image', maxCount: 1 }
]);

// ===--- Routes with more specific paths must come first ---===

// GET /api/questions/filters - Gets all unique filter options
router.get('/filters', getFilterOptions);

// GET /api/questions/stats - Gets dashboard stats (Protected)
router.get('/stats', protect, getQuestionStats);

// ===--- General Routes ---===

// GET /api/questions - Gets all questions (can be filtered with query params)
// POST /api/questions - Creates a new question (Protected)
router.route('/')
    .get(getQuestions)
    .post(protect, imageUploadFields, createQuestion);

// ===--- Routes with dynamic :id parameter must come last ---===

// GET /api/questions/:id - Gets a single question
// PUT /api/questions/:id - Updates a question (Protected)
// DELETE /api/questions/:id - Deletes a question (Protected)
router.route('/:id')
    .get(getQuestionById)
    .put(protect, imageUploadFields, updateQuestion)
    .delete(protect, deleteQuestion);

module.exports = router;