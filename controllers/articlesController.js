// controllers/articleController.js

// POST: Save article
async function saveArticle(req, res) {
  const dbClient = req.app.get('dbClient');
  const { article_id } = req.body;
  const user_id = req.user.user_id;
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

// POST : Unsave Article
async function removeSavedArticle(req, res) {
  const dbClient = req.app.get('dbClient');
  const { article_id } = req.body;
  const user_id = req.user.user_id;

  // Validate request body
  if (!user_id || !article_id) {
    return res.status(400).json({ error: 'user_id and article_id are required' });
  }

  try {
    // Check if the article is actually saved by the user
    const checkQuery = 'SELECT 1 FROM saved WHERE user_id = $1 AND article_id = $2';
    const checkResult = await dbClient.query(checkQuery, [user_id, article_id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Article is not saved' });
    }

    // Delete the saved article
    const deleteQuery = 'DELETE FROM saved WHERE user_id = $1 AND article_id = $2';
    await dbClient.query(deleteQuery, [user_id, article_id]);

    // Respond with success
    res.status(200).json({ message: 'Article removed successfully' });
  } catch (err) {
    console.error('Error removing saved article:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


  
  // POST: Clicked Article
  async function clickArticle(req, res) {
    const dbClient = req.app.get('dbClient');
    const { article_id } = req.body;
    const user_id = req.user.user_id;
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
        INSERT INTO clicked_on (user_id, article_id)
        VALUES ($1, $2)
        RETURNING saved_at
        
      `;
      const result = await dbClient.query(insertQuery, [user_id, article_id]);
  
      return res.status(200).json({ status: 'success', message: 'Article click recorded successfully.' });
    } catch (error) {
      console.error(`Error recording click for user ${user_id}, article ${article_id}:`, error.message);
      return res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
  }
  
  
  module.exports = { saveArticle, clickArticle, removeSavedArticle};
  