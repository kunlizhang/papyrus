// routes/auth.js
const express = require('express');
const { verifySession } = require("../controllers/authMiddleware");

const { registerUser, loginUser, logoutUser, getUserSavedArticles, getUserClickedArticles, addUserInterest, removeUserInterest } = require('../controllers/userController');

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for authentication
router.post('/verify', verifySession);

// Route for user logout
router.post('/logout', logoutUser);

// Route for getting user articles
router.get('/getSavedArticles', verifySession, getUserSavedArticles);

// Route for getting clicked articles
router.get('/getClickedArticles', getUserClickedArticles);

// Route for adding user interest
router.post('/addInterest', verifySession, addUserInterest);

// Route for removing user interest
router.post('/removeInterest', verifySession, removeUserInterest);


module.exports = router;
