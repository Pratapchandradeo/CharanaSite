const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const { authenticateToken } = require('../middleware/auth.middleware');
const activityLogger = require('../utils/activityLogger');

// Rate limiting for login attempts (simple in-memory)
const loginAttempts = new Map();

// Clean up old entries every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  for (const [key, timestamp] of loginAttempts.entries()) {
    if (timestamp < oneHourAgo) {
      loginAttempts.delete(key);
    }
  }
}, 3600000);

// Login route with rate limiting
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Check rate limit (5 attempts per hour per IP)
    const attemptKey = `${clientIp}_${username}`;
    const attemptCount = loginAttempts.get(attemptKey) || 0;
    
    if (attemptCount >= 5) {
      return res.status(429).json({ 
        success: false,
        error: 'Too many login attempts. Please try again later.' 
      });
    }

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Username and password required' 
      });
    }

    // Get user with all permission fields
    const user = await db.getAsync(
      `SELECT id, username, password_hash, full_name, mobile_no, address, role,
              can_manage_admins, can_manage_events, can_manage_gallery,
              can_manage_pdfs, can_manage_notifications, is_active,
              created_at, last_login
       FROM admin_users 
       WHERE username = ?`,
      [username]
    );

    if (!user) {
      // Increment failed attempt
      loginAttempts.set(attemptKey, attemptCount + 1);
      
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({ 
        success: false,
        error: 'Account is deactivated. Contact master admin.' 
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      // Increment failed attempt
      loginAttempts.set(attemptKey, attemptCount + 1);
      
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Clear failed attempts on success
    loginAttempts.delete(attemptKey);

    // Update last login
    await db.runAsync(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Generate JWT with permissions
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        permissions: {
          admins: user.can_manage_admins === 1,
          events: user.can_manage_events === 1,
          gallery: user.can_manage_gallery === 1,
          pdfs: user.can_manage_pdfs === 1,
          notifications: user.can_manage_notifications === 1
        }
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { 
        expiresIn: process.env.JWT_EXPIRE || '7d',
        issuer: 'jagannath-temple-api',
        audience: 'jagannath-admin'
      }
    );

    // Log successful login
    await activityLogger.log(
      user.id,
      'LOGIN_SUCCESS',
      'admin_users',
      user.id,
      null,
      { username: user.username },
      req
    );

    // Return user data (without password hash)
    const userData = {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      mobile_no: user.mobile_no,
      address: user.address,
      role: user.role,
      permissions: {
        admins: user.can_manage_admins === 1,
        events: user.can_manage_events === 1,
        gallery: user.can_manage_gallery === 1,
        pdfs: user.can_manage_pdfs === 1,
        notifications: user.can_manage_notifications === 1
      },
      last_login: user.last_login,
      created_at: user.created_at
    };

    res.json({
      success: true,
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// Verify token and get current user
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    // User is already attached by authenticateToken middleware
    const userData = {
      id: req.user.id,
      username: req.user.username,
      full_name: req.user.full_name,
      mobile_no: req.user.mobile_no,
      address: req.user.address,
      role: req.user.role,
      permissions: {
        admins: req.user.can_manage_admins === 1,
        events: req.user.can_manage_events === 1,
        gallery: req.user.can_manage_gallery === 1,
        pdfs: req.user.can_manage_pdfs === 1,
        notifications: req.user.can_manage_notifications === 1
      }
    };

    res.json({ 
      success: true, 
      user: userData
    });

  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// Change password (for logged in users)
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        error: 'Current password and new password required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'New password must be at least 6 characters' 
      });
    }

    // Get user with current password hash
    const user = await db.getAsync(
      'SELECT password_hash FROM admin_users WHERE id = ?',
      [req.user.id]
    );

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);

    // Update password
    await db.runAsync(
      'UPDATE admin_users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, req.user.id]
    );

    // Log activity
    await activityLogger.log(
      req.user.id,
      'CHANGE_PASSWORD',
      'admin_users',
      req.user.id,
      null,
      null,
      req
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// Logout (client-side only, but we can blacklist token if needed)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Log logout activity
    await activityLogger.log(
      req.user.id,
      'LOGOUT',
      'admin_users',
      req.user.id,
      null,
      null,
      req
    );

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

module.exports = router;