// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('pg'); // Import pg Client
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app = express();

// Enable CORS for all routes
app.use(cors()); 

// To parse incoming JSON request bodies
app.use(express.json()); 

// Create a new PostgreSQL client using environment variables
const client = new Client({
  host: process.env.RDS_HOSTNAME, // RDS host
  user: process.env.RDS_USERNAME, // RDS user
  password: process.env.RDS_PASSWORD, // RDS password
  port: process.env.RDS_PORT, // RDS port (5432)
  database: process.env.RDS_DB_NAME, // Database name (papyrus)
  ssl: {
    rejectUnauthorized: false // Use SSL for AWS RDS
  }
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
app.set('dbClient', client); // You can access the db client in routes using req.app.get('dbClient')

// Use auth routes
app.use('/auth', authRoutes);
app.use('/data', dataRoutes);

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
