const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A title is required for the post.'],
        trim: true,
        unique: true,
    },
    content: {
        type: String,
        required: [true, 'Content is required for the post.'],
    },
    // A 'slug' is a URL-friendly version of the title, e.g., "how-to-crack-nimcet"
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    // You can categorize posts as 'Blog', 'News', 'Notification', etc.
    category: {
        type: String,
        required: true,
        default: 'General',
    },
    // An optional featured image for each post
    featuredImage: {
        type: String,
        default: '',
    },
    author: {
        type: String, // Storing admin username for simplicity
        required: true,
    },
    // SEO fields
    metaDescription: {
        type: String,
        trim: true,
    },
    keywords: {
        type: [String],
        default: [],
    }
}, { timestamps: true });

// This function automatically creates a URL-friendly 'slug' from the title before saving


module.exports = mongoose.model('Post', postSchema);
