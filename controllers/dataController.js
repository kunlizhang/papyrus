// GET: Get Recent Articles
const getRecentArticles = async (req, res) => {  
  // currentDate = '2025-01-31' = January 31, 2025
  const currentDate= req.body.currentDate;
  console.log(currentDate);

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

module.exports = { getRecentArticles };
