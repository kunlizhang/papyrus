// controllers/authController.js
const bcrypt = require('bcrypt');

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

    // If the login is successful, return user details (excluding password)
    console.log(`User successfully logged in`)
    delete user.password; // Don't return the password
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Error logging in user:', err.stack);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = { registerUser, loginUser };
