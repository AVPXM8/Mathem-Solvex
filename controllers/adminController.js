//This handles secure admin registration and login
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new admin
// @route   POST /api/admin/register
exports.registerAdmin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const adminExists = await AdminUser.findOne({ username });
    if (adminExists) {
        return res.status(400).json({ message: 'Admin user already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
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

// @desc    Authenticate/login an admin
// @route   POST /api/admin/login
exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    const admin = await AdminUser.findOne({ username });

    if (admin && (await bcrypt.compare(password, admin.password))) {
        res.json({
            _id: admin.id,
            username: admin.username,
            token: generateToken(admin._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get current admin data
// @route   GET /api/admin/me
exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};