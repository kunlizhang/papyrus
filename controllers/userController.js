// controllers/userController.js
const PREDEFINED_INTERESTS = [
  'Technology', 'Sports', 'Music', 'Movies', 
  'Science', 'Politics', 'Finance', 'Health', 
  'Travel', 'Food', 'Gaming', 'Art'
];

const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating secure session tokens

const sessions = {}; 

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

// POST: User Login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const dbClient = req.app.get('dbClient');
    const result = await dbClient.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      console.log(`error: Username does not exist`)
      return res.status(400).json({ error: 'Username does not exist' });
    }

    const user = result.rows[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        console.log(`error: Password is not correct`)
      return res.status(400).json({ error: 'Invalid password' });
    }
    // Generate a session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // Store the session in memory (keyed by sessionToken)
    sessions[sessionToken] = { userId: user.id, username: user.username };


    // Set the session token as an HttpOnly cookie
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Respond with success
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error logging in user:', err.stack);
    res.status(500).json({ error: 'Database error' });
  }
};

// Middleware to authenticate users
const authenticateUser = (req, res, next) => {
  const sessionToken = req.cookies.session_token;

  if (!sessionToken || !sessions[sessionToken]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Attach user info to the request object for downstream handlers
  req.user = sessions[sessionToken];
  next();
};

// User Logout
const logoutUser = (req, res) => {
  const sessionToken = req.cookies.session_token;

  if (sessionToken) {
    // Remove the session from the in-memory store
    delete sessions[sessionToken];
  }

  // Clear the cookie
  res.clearCookie('session_token');
  res.status(200).json({ message: 'Logout successful' });
};

// GET: get Saved Articles for user
const getUserSavedArticles = async (req, res) => {
  const userId = req.user.id;

  try {
    const dbClient = req.app.get('dbClient');
    
    // Retrieve saved articles sorted by most recently saved
    const result = await dbClient.query(`
      SELECT a.*, s.saved_at
      FROM articles a
      JOIN saved_articles s ON a.article_id = s.article_id
      WHERE s.user_id = $1
      ORDER BY s.saved_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving saved articles:', error);
    res.status(500).json({ error: 'Could not retrieve saved articles' });
  }
};

// POST: Add User Interest
const addUserInterest = async (req, res) => {
  const { interest } = req.body;
  const userId = req.user.id; // Assuming you have authentication middleware

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
  const userId = req.user.id;

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


module.exports = { registerUser, loginUser, authenticateUser, logoutUser, getUserSavedArticles, addUserInterest, removeUserInterest};
