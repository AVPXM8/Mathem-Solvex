// middleware/authMiddleware.js - FINAL CLEAN VERSION

const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token and attach it to the request object
            req.user = await AdminUser.findById(decoded.id).select('-password');
            
            if (!req.user) {
                 return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Move to the next function
        } catch (error) {
            console.error('Auth Error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };