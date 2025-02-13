// routes/data.js
const express = require('express');
const { getRecentArticles, getArticlesData, getRecommendations} = require('../controllers/dataController');
const router = express.Router();
const { verifySession } = require("../controllers/authMiddleware");


// Route for getting articles 
router.get('/getRecentArticles', getRecentArticles);

// Route for getting article data
router.get('/getArticlesData', getArticlesData);

// Route for getting recommendations
router.get('/getRecommendations', verifySession, getRecommendations);

// Route for getting article data
router.get('/getArticlesData', verifySession, getArticlesData);
module.exports = router;
