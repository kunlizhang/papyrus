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
  const articleIds = req.body.articleIds; // Expecting articleIds in the request body

  if (!Array.isArray(articleIds) || articleIds.length === 0) {
    return res.status(400).json({ error: "articleIds must be a non-empty array"});
  }
  try {
    const dbClient = req.app.get('dbClient');
    
    // Retrieve saved articles sorted by most recently saved
    const result = await dbClient.query(`
      SELECT * FROM articles WHERE article_id = ANY($1)`, [articleIds]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving article data:', error);
    res.status(500).json({ error: 'Could not retrieve all article data' });
  }
};

async function getRecommendations(req, res) {
  try {
    const user_id = req.user.user_id;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const response = await fetch(`http://localhost:8000/getRecommendations?user_id=${user_id}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}

module.exports = { getRecentArticles, getArticlesData, getRecommendations };
