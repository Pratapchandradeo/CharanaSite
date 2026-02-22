const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs-extra');
const helmet = require('helmet'); // Install: npm install helmet

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const adminUsersRoutes = require('./src/routes/admin-users.routes');
const notificationRoutes = require('./src/routes/notifications.routes');
const eventRoutes = require('./src/routes/events.routes');
const galleryRoutes = require('./src/routes/gallery.routes');
const pdfRoutes = require('./src/routes/pdf.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "http://localhost:5173"],
    },
  },
}));

// Remove X-Powered-By header
app.disable('x-powered-by');

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parser with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Serve static files with cache control
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    }
  }
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin-users', adminUsersRoutes); // New route for admin management
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/pdfs', pdfRoutes);

// Health check (public)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Jagannath Temple API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(err.status || 500).json({ 
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server with initialization
async function startServer() {
  try {
    // Initialize database and auth system
    const db = require('./src/utils/db');
    await db.initializeAuthSystem();

    // Start listening
    app.listen(PORT, () => {
      console.log(`
  🛕 Jagannath Temple Backend Server
  =================================
  🌐 Server: http://localhost:${PORT}
  📁 Uploads: ${path.join(__dirname, 'uploads')}
  💾 Database: ${path.join(__dirname, 'database', 'jagannath.db')}
  🔒 Security: Enabled
  👤 Master Admin: ${process.env.MASTER_ADMIN_USERNAME || 'masteradmin'}
  =================================
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();