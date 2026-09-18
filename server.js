const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const db = require('./config/db');
if (typeof db === 'function') {
  db();
} else if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully!'))
    .catch((err) => console.error('MongoDB Connection Error:', err));
}

// Serve static assets from public, disabling automatic index.html serving
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// API Routes
try {
  app.use('/api', require('./routes/api'));
} catch (e) {
  try { app.use('/api/auth', require('./controllers/authController')); } catch (err) {}
  try { app.use('/api/lab', require('./controllers/LabController')); } catch (err) {}
}

// Explicit View Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Wildcard Fallback for Express v5 / path-to-regexp v8+
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});