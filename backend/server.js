const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Specific routes for static HTML pages
  app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'login.html'));
  });

  app.get('/register', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'register.html'));
  });

  // Dashboard and task-related routes
  app.get('/dashboard', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'dashboard.html'));
  });
  
  app.get('/tasks/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'dashboard.html'));
  });

  // Home page
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
  
  // All other routes go to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
