// controllers/authController.js
const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Register new user
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username already exists
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const newUser = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const user = userResult.rows[0];

    // Compare the provided password with the stored hashed password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // If valid, return a success message
    res.json({ message: 'Login successful!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };
