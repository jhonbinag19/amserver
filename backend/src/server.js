const express = require('express');
const cors = require('cors');
const testRoutes = require('./routes/test');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/test', testRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 