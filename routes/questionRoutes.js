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
    getFilterOptions,
    getRelatedQuestions
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

 
// GET /api/questions/filters - Gets all unique filter options
router.get('/filters', getFilterOptions);

// GET /api/questions/stats - Gets dashboard stats (Protected)
router.get('/stats', protect, getQuestionStats);
router.get('/:id/related', getRelatedQuestions);

router.route('/')
    .get(getQuestions)
    .post(protect, imageUploadFields, createQuestion);

 
router.route('/:id')
    .get(getQuestionById)
    .put(protect, imageUploadFields, updateQuestion)
    .delete(protect, deleteQuestion);

module.exports = router;