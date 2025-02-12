// controllers/userController.js
const PREDEFINED_INTERESTS = [
  'Technology', 'Sports', 'Music', 'Movies', 
  'Science', 'Politics', 'Finance', 'Health', 
  'Travel', 'Food', 'Gaming', 'Art'
];

const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating secure session tokens

// POST: User Registration
const registerUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(username)
  console.log(password)

  try {
    // Check if the user already exists
    const dbClient = req.app.get('dbClient');
    const userCheck = await dbClient.query(
      'SELECT * FROM users WHERE username = $1', 
      [username]
    );

    if (userCheck.rows.length > 0) {
      console.log(`error: 'Username already exists'`)
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await dbClient.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', 
      [username, hashedPassword]
    );

    // Respond with the newly created user (excluding the password)
    const newUser = result.rows[0];
    delete newUser.password; // Don't return the password

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error registering user:', err.stack);
    res.status(500).json({ error: 'Database error' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const dbClient = req.app.get('dbClient');

    // Check if the user exists
    const result = await dbClient.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      console.log(`error: Username does not exist`);
      return res.status(400).json({ error: 'Username does not exist' });
    }

    const user = result.rows[0];

    // Compare provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`error: Password is not correct`);
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate a session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    // Store session in the sessions table
    await dbClient.query(
      `INSERT INTO sessions (session_id, user_id, expires_at) VALUES ($1, $2, $3)`,
      [sessionToken, user.user_id, expiresAt]
    );

    // Set the session token as an HttpOnly cookie
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge:  60 * 60 * 1000, // 1 hour
    });

    console.log(`User ${user.user_id} logged in with session ${sessionToken}`);

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error logging in user:', err.stack);
    res.status(500).json({ error: 'Database error' });
  }
};

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


// User Logout
const logoutUser = async (req, res) => {
  const dbClient = req.app.get('dbClient');
  const sessionToken = req.cookies.session_token;

  if (!sessionToken) {
    return res.status(400).json({ error: 'No active session' });
  }

  try {
    await dbClient.query('DELETE FROM sessions WHERE session_id = $1', [sessionToken]);
    res.clearCookie('session_token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Error logging out:', err);
    res.status(500).json({ error: 'Database error' });
  }
};


// GET: Get Saved Articles for the authenticated user
const getUserSavedArticles = async (req, res) => {
  try {
    const dbClient = req.app.get('dbClient');
    
    // Get user_id from session (set by verifySession middleware)
    const userId = req.user.user_id;

    // Retrieve saved articles sorted by most recently saved
    const result = await dbClient.query(
      `
      SELECT a.*, s.saved_at
      FROM articles a
      JOIN saved_articles s ON a.article_id = s.article_id
      WHERE s.user_id = $1
      ORDER BY s.saved_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving saved articles:', error);
    res.status(500).json({ error: 'Could not retrieve saved articles' });
  }
};

// GET: Get Clicked Articles for the authenticated user
const getUserClickedArticles = async (req, res) => {
  try {
    const dbClient = req.app.get('dbClient');
    console.log("getting clicked articles")
    
    // Get user_id from session (set by verifySession middleware)
    const userId = req.user.user_id;

    // Retrieve clicked articles sorted by most recently clicked
    const result = await dbClient.query(
      `
      SELECT article_id
      FROM clicked_on 
      WHERE user_id = $1
      ORDER BY saved_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving saved articles:', error);
    res.status(500).json({ error: 'Could not retrieve saved articles' });
  }
};


// POST: Add User Interest
const addUserInterest = async (req, res) => {
  const { interest } = req.body;

  // Get user_id from session (set by verifySession middleware)
  const userId = req.user.user_id;

  // Validate interest
  if (!PREDEFINED_INTERESTS.includes(interest)) {
    return res.status(400).json({ error: 'Invalid interest' });
  }

  try {
    const dbClient = req.app.get('dbClient');
    
    // PostgreSQL query to add interest to user's interests array
    const result = await dbClient.query(`
      UPDATE users 
      SET interests = array_append(
        COALESCE(interests, ARRAY[]::TEXT[]), 
        $1
      )
      WHERE user_id = $2 
      AND NOT($1 = ANY(interests))
      RETURNING interests
    `, [interest, userId]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Interest already exists' });
    }

    res.json({ interests: result.rows[0].interests });
  } catch (error) {
    console.error('Error adding interest:', error);
    res.status(500).json({ error: 'Could not add interest' });
  }
};

// POST: Remove User Interest
const removeUserInterest = async (req, res) => {
  const { interest } = req.body;
  // Get user_id from session (set by verifySession middleware)
  const userId = req.user.user_id;

  try {
    const dbClient = req.app.get('dbClient');
    
    // PostgreSQL query to remove interest from user's interests array
    const result = await dbClient.query(`
      UPDATE users 
      SET interests = array_remove(interests, $1)
      WHERE user_id = $2
      RETURNING interests
    `, [interest, userId]);

    res.json({ interests: result.rows[0].interests });
  } catch (error) {
    console.error('Error removing interest:', error);
    res.status(500).json({ error: 'Could not remove interest' });
  }
};


module.exports = { registerUser, loginUser, verifySession, logoutUser, getUserSavedArticles, getUserClickedArticles, addUserInterest, removeUserInterest};
