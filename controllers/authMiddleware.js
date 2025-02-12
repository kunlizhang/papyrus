// controllers/authMiddleware

// Middleware to verify session
const verifySession = async (req, res, next) => {
    const dbClient = req.app.get('dbClient');
    const sessionToken = req.cookies.session_token;
  
    if (!sessionToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      const result = await dbClient.query(
        'SELECT * FROM sessions WHERE session_id = $1 AND expires_at > NOW()',
        [sessionToken]
      );
  
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Session expired or invalid' });
      }
  
      req.user = result.rows[0]; // Attach session data to the request
      next();
    } catch (err) {
      console.error('Error verifying session:', err);
      res.status(500).json({ error: 'Database error' });
    }
    
    // req.user = {user_id : 1}
    // next();
    // uncomment and comment everything else out for testing 
  };

module.exports = { verifySession };

