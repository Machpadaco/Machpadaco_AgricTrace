require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/machpadaco_agritrace';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected: Machpadaco AgriTrace DB'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Routes
app.use('/api/farmers', require('./routes/farmers'));
app.use('/api/allocations', require('./routes/allocations'));
app.use('/api/receipts', require('./routes/receipts'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Root - Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check - Fictional data note for capstone
app.get('/health', (req, res) => {
  res.json({
    brand: 'Machpadaco Global Services',
    system: 'Machpadaco AgriTrace',
    module: 'Fertilizer Pilot',
    status: 'running',
    note: 'Fictional data only - 3MTT x Meta Capstone',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Fallback for SPA routing (optional)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Machpadaco AgriTrace running on http://localhost:${PORT}`);
  console.log(`Brand Colors: Deep Navy #0F172A | Tech Blue #1491A2 | Cyan #06B6D4`);
});
