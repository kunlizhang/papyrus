// routes/articles.js
const express = require('express');
const { saveArticle, clickArticle } = require('../controllers/articlesController');


const router = express.Router();


// Route for user saving
router.post('/save',saveArticle);

// Route for user clicking
router.post('/click', clickArticle);


module.exports = router;
