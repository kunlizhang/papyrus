// controllers/authController.js
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating secure session tokens

const sessions = {}; 

// User Registration
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

// User Login
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

module.exports = { registerUser, loginUser, authenticateUser, logoutUser };