const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { connectDB } = require('./database');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const { authenticateUser } = require('./middleware/auth');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
connectDB();

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Protected route example
app.get('/api/protected', authenticateUser, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('GET  /api/test');
  console.log('POST /api/auth/login');
  console.log('GET  /api/auth/verify');
  console.log('GET  /api/users/profile');
  console.log('GET  /api/users/billing');
  console.log('GET  /api/users/integrations');
  console.log('GET  /api/users/dashboard');
  console.log('GET  /api/users/workflow-actions');
}); 