// controllers/articleController.js

// Save an article for a user
async function saveArticle(req, res) {
  const dbClient = req.app.get('dbClient');
  const { user_id, article_id } = req.body;

  // Validate request body
  if (!user_id || !article_id) {
    return res.status(400).json({ error: 'user_id and article_id are required' });
  }

  try {
    // Check if the article is already saved by the user
    const checkQuery = 'SELECT 1 FROM saved WHERE user_id = $1 AND article_id = $2';
    const checkResult = await dbClient.query(checkQuery, [user_id, article_id]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'Article is already saved' });
    }

    // Insert a new row into the saved table
    const insertQuery = `
      INSERT INTO saved (user_id, article_id)
      VALUES ($1, $2)
      RETURNING saved_at
    `;
    const insertResult = await dbClient.query(insertQuery, [user_id, article_id]);

    // Respond with success and the timestamp when the article was saved
    res.status(200).json({
      message: 'Article saved successfully',
      saved_at: insertResult.rows[0].saved_at,
    });
  } catch (err) {
    console.error('Error saving article:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

  
  // Record a clicked article
  async function clickArticle(req, res) {
    const dbClient = req.app.get('dbClient');
    const { user_id, article_id } = req.body;
  
    // Validate input
    if (!user_id || !article_id) {
      return res.status(400).json({ status: 'error', message: 'user_id and article_id are required' });
    }
    if (!Number.isInteger(user_id) || !Number.isInteger(article_id)) {
      return res.status(400).json({ status: 'error', message: 'user_id and article_id must be integers' });
    }
  
    try {
      // Insert the clicked article or handle conflict
      const insertQuery = `
        INSERT INTO clickedon (user_id, article_id, clicked_at)
        VALUES ($1, $2, NOW())
        
      `;
      const result = await dbClient.query(insertQuery, [user_id, article_id]);
  
      return res.status(200).json({ status: 'success', message: 'Article click recorded successfully.' });
    } catch (error) {
      console.error(`Error recording click for user ${user_id}, article ${article_id}:`, error.message);
      return res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
  }
  
  
  module.exports = { saveArticle, clickArticle };
  