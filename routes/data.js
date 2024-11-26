// routes/auth.js
const express = require('express');
const { getRecentArticles } = require('../controllers/dataController');
const router = express.Router();

// Route for user registration
router.post('/getArticles', getRecentArticles);

module.exports = router;
