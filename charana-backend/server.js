const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs-extra');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const notificationRoutes = require('./src/routes/notifications.routes');
const eventRoutes = require('./src/routes/events.routes');
const galleryRoutes = require('./src/routes/gallery.routes');
const pdfRoutes = require('./src/routes/pdf.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload directories exist
const uploadDirs = [
  './uploads/gallery/full',
  './uploads/gallery/thumb',
  './uploads/events',
  './uploads/pdfs'
];

uploadDirs.forEach(dir => {
  fs.ensureDirSync(dir);
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your React frontend
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/pdfs', pdfRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Jagannath Temple API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
  🛕 Jagannath Temple Backend Server
  =================================
  🌐 Server: http://localhost:${PORT}
  📁 Uploads: ${path.join(__dirname, 'uploads')}
  💾 Database: ${path.join(__dirname, 'database', 'jagannath.db')}
  =================================
  `);
});