// controllers/adminController.js - FINAL VERSION

// We need axios here to make a request to Google's reCAPTCHA server
const axios = require('axios'); 
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// This function generates the secure login token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// This function registers a new admin (usually only used once)
exports.registerAdmin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const adminExists = await AdminUser.findOne({ username });
    if (adminExists) {
        return res.status(400).json({ message: 'Admin user already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await AdminUser.create({
        username,
        password: hashedPassword,
    });

    if (admin) {
        res.status(201).json({
            _id: admin.id,
            username: admin.username,
            token: generateToken(admin._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid admin data' });
    }
};

// This is the updated login function with the reCAPTCHA check
exports.loginAdmin = async (req, res) => {
    const { username, password, recaptchaToken } = req.body;

    // 1. First, check if the user completed the CAPTCHA on the frontend
    if (!recaptchaToken) {
        return res.status(400).json({ message: 'Please complete the CAPTCHA verification.' });
    }

    // 2. Secretly verify the CAPTCHA response with Google
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
        
        const response = await axios.post(verificationURL);
        
        if (!response.data.success) {
            // If Google says the verification failed, block the login attempt
            return res.status(400).json({ message: 'reCAPTCHA verification failed. Are you a robot?' });
        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return res.status(500).json({ message: 'Error during reCAPTCHA verification.' });
    }

    // 3. Only if CAPTCHA is valid, proceed with checking the username and password
    const admin = await AdminUser.findOne({ username });
    if (admin && (await bcrypt.compare(password, admin.password))) {
        res.json({
            _id: admin.id,
            username: admin.username,
            token: generateToken(admin._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid username or password' });
    }
};

// This function gets the current admin's data for secure pages
exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};