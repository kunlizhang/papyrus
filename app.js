require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const cookieParser = require('cookie-parser'); // Added for cookie handling
const userRoutes = require('./routes/users');
const dataRoutes = require('./routes/data');
const articleRoutes = require('./routes/articles');

const app = express();

// Enable CORS with credentials support
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // React app URL
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser()); // Added cookie parser middleware

// Create a new PostgreSQL client using environment variables
const client = new Client({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_DB_NAME,
  ssl: {
    rejectUnauthorized: false, // Use SSL for AWS RDS
  },
});

// Connect to the PostgreSQL database
client.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database.');
  }
});

// Make the client available throughout the app
app.set('dbClient', client);

// Use auth routes
app.use('/users', userRoutes);
app.use('/data', dataRoutes);
app.use('/articles', articleRoutes);

// Gracefully close the DB connection when the app is terminated
process.on('SIGINT', () => {
  client.end((err) => {
    if (err) {
      console.error('Error closing the database connection', err.stack);
    }
    console.log('Database connection closed.');
    process.exit();
  });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
