// routes/auth.js
const express = require('express');
const { getRecentArticles } = require('../controllers/dataController');
const router = express.Router();

// Route for user registration
router.get('/getRecentArticles', getRecentArticles);

module.exports = router;
