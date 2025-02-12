// routes/articles.js
const express = require('express');
const { saveArticle, clickArticle } = require('../controllers/articlesController');
const { verifySession } = require('../controllers/userController');


const router = express.Router();


// Route for user saving
router.post('/save', verifySession, saveArticle);

// Route for user clicking
router.post('/click', verifySession, clickArticle);


module.exports = router;
