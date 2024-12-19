require('dotenv').config(); // Load environment variables

const mysql = require('mysql2');

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // Database host (e.g., localhost)
  user: process.env.DB_USER,       // Your MySQL username
  password: process.env.DB_PASSWORD, // Your MySQL password
  database: process.env.DB_NAME    // The database you want to connect to
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit the process if connection fails
  }
  console.log('Connected to MySQL database.');

  // Example SELECT statement to fetch all users from the users table
  const selectQuery = 'SELECT * FROM users';

  // Execute the SELECT query
  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return;
    }

    // Log the results
    console.log('Query results:', results);  // `results` will be an array of rows
  });
});

// Export the database connection for use in other parts of your project
module.exports = db;
