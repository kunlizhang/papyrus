// routes/data.js
const express = require('express');
const { getRecentArticles, getArticlesData} = require('../controllers/dataController');
const router = express.Router();

// Route for getting articles 
router.get('/getRecentArticles', getRecentArticles);

// Route for getting article data
router.get('/getArticlesData', getArticlesData);
module.exports = router;
