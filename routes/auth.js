// routes/auth.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// POST /auth/register - User registration route
router.post('/register', registerUser);

// POST /auth/login - User login route
router.post('/login', loginUser);

module.exports = router;
