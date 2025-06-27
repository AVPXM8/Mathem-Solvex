const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getMe } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimitMiddleware');

//router.post('/register', registerAdmin);
router.post('/login',loginLimiter, loginAdmin);
router.get('/me', protect, getMe);

module.exports = router;