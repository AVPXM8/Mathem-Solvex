const express = require('express');
const router = express.Router();
const { createReport, getReports, deleteReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

// Public route for creating a report
router.route('/').post(createReport);

// Admin-only route for viewing all reports
router.route('/').get(protect, getReports);
router.route('/:id').delete(protect, deleteReport);


module.exports = router;