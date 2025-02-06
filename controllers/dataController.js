// GET: Get Recent Articles
const getRecentArticles = async (req, res) => {  
  // currentDate = '2025-01-31' = January 31, 2025
  const currentDate= req.body.currentDate;

  try {
    const dbClient = req.app.get('dbClient');
    
    // Retrieve saved articles sorted by most recently saved
    const result = await dbClient.query(`
      SELECT a.*
      FROM articles a
      WHERE a.date = $1`, [currentDate]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving all new articles:', error);
    res.status(500).json({ error: 'Could not retrieve all new articles' });
  }
};

// GET: Get Article Data by ID
const getArticlesData = async (req, res) => {
  const { articleIds } = req.body.articleIds; // Expecting articleIds in the request body

  if (!Array.isArray(articleIds) || articleIds.length === 0) {
    return res.status(400).json({ error: "articleIds must be a non-empty array" });
  }
  try {
    const dbClient = req.app.get('dbClient');
    
    // Retrieve saved articles sorted by most recently saved
    const result = await dbClient.query(`
      SELECT * FROM articles WHERE id = ANY($1)`, [articleIds]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving article data:', error);
    res.status(500).json({ error: 'Could not retrieve all article data' });
  }
};

module.exports = { getRecentArticles, getArticlesData };
