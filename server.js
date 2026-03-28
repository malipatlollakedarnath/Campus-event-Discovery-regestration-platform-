require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ✅ Using in-memory mock database for testing (MongoDB not required)
console.log('✓ Using in-memory mock database');

// Routes
app.use('/api/auth', require('./auth-routes'));
app.use('/api/events', require('./events-routes'));
app.use('/api/student', require('./student-routes'));
app.use('/api/admin', require('./admin-routes'));

// Serve frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Campus Events API running on http://localhost:${PORT}`);
  console.log(`📚 Server started at ${new Date().toLocaleTimeString()}\n`);
});
