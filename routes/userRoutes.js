const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser); // Register
router.post('/login', loginUser);       // Login

// Protected Route
router.get('/me', authMiddleware, getMe); // Get user profile

module.exports = router;
