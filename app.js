// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

// MongoDB connection 
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};

mongoose.connect(process.env.MONGODB_URI, clientOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1); // Exit the app if the database connection fails
  });

// Check MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to database.');
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err.message}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
