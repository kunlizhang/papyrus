// routes/articles.js
const express = require('express');
const { saveArticle, clickArticle, removeSavedArticle, isSaved} = require('../controllers/articlesController');
const { verifySession } = require("../controllers/authMiddleware");


const router = express.Router();


// Route for user saving
router.post('/save',verifySession, saveArticle);

// Route for remove saved
router.post('/removeSaved', verifySession, removeSavedArticle);

// Route for user clicking
router.post('/click', verifySession, clickArticle);

router.post('/isSaved', verifySession, isSaved)


module.exports = router;
