// middleware/rateLimitMiddleware.js
const rateLimit = require('express-rate-limit');

// This is the configuration for our login rate limiter
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // The time window (15 minutes)
    max: 5, // Limit each IP to 5 login requests per window
    message: {
        message: 'Too many login attempts from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { loginLimiter };