const express = require('express');
const router = express.Router();
const { getPosts, getPostBySlug, getPostById, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// ===--- Public Routes (for students and SEO crawlers) ---===
router.get('/', getPosts);
router.get('/:slug', getPostBySlug);

// ===--- Admin-Only Protected Routes ---===
router.get('/id/:id', protect, getPostById); // This gets a post by its database ID
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
