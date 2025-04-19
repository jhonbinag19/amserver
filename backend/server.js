const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./database');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('GET  /api/test');
  console.log('POST /api/auth/login');
  console.log('GET  /api/auth/verify');
  console.log('GET  /api/users/profile');
  console.log('GET  /api/users/settings');
  console.log('GET  /api/users/billing');
  console.log('GET  /api/users/integrations');
});