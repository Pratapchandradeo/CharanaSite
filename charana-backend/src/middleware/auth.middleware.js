const jwt = require('jsonwebtoken');
const db = require('../utils/db');

// Authenticate token and attach user to request
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Access token required' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get full user details including permissions
    const user = await db.getAsync(
      `SELECT id, username, full_name, mobile_no, address, role, 
              can_manage_admins, can_manage_events, can_manage_gallery, 
              can_manage_pdfs, can_manage_notifications, is_active 
       FROM admin_users 
       WHERE id = ? AND is_active = 1`,
      [decoded.id]
    );
    
    if (!user) {
      return res.status(403).json({ 
        success: false,
        error: 'User not found or inactive' 
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired' 
      });
    }
    return res.status(403).json({ 
      success: false,
      error: 'Invalid or expired token' 
    });
  }
};

// Master admin only access
const requireMasterAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentication required' 
    });
  }
  
  if (req.user.role !== 'master_admin') {
    return res.status(403).json({ 
      success: false,
      error: 'Master admin access required' 
    });
  }
  
  next();
};

// Permission-based access
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    // Master admin has all permissions
    if (req.user.role === 'master_admin') {
      return next();
    }

    // Check specific permission
    if (!req.user[permission]) {
      return res.status(403).json({ 
        success: false,
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Optional: Check if user is active
const requireActive = (req, res, next) => {
  if (!req.user.is_active) {
    return res.status(403).json({ 
      success: false,
      error: 'Account is deactivated' 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireMasterAdmin,
  requirePermission,
  requireActive
};