// routes/auth.js
const express = require('express');
const { registerUser, loginUser, authenticateUser, logoutUser, getUserSavedArticles, addUserInterest, removeUserInterest } = require('../controllers/userController');
const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for user authentication
router.post('/authenticate', authenticateUser);

// Route for user logout
router.post('/logout', logoutUser);

// Route for getting user articles
router.get('/getSavedArticles', getUserSavedArticles);

// Route for adding user interest
router.post('/addInterest', addUserInterest);

// Route for removing user interest
router.post('/removeInterest', removeUserInterest);


module.exports = router;
