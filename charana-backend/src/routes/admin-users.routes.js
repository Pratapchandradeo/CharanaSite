const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../utils/db');
const { authenticateToken, requireMasterAdmin } = require('../middleware/auth.middleware');
const activityLogger = require('../utils/activityLogger');

// ========== MASTER ADMIN ONLY ROUTES ==========

// GET all admin users
router.get('/', authenticateToken, requireMasterAdmin, async (req, res) => {
  try {
    const users = await db.allAsync(
      `SELECT id, username, full_name, mobile_no, address, role,
              can_manage_admins, can_manage_events, can_manage_gallery,
              can_manage_pdfs, can_manage_notifications, is_active,
              created_at, last_login
       FROM admin_users
       ORDER BY id ASC`
    );

    // Remove sensitive data
    const safeUsers = users.map(user => ({
      ...user,
      // Don't send password hash
    }));

    res.json({
      success: true,
      users: safeUsers
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch admin users' 
    });
  }
});

// GET single admin user
router.get('/:id', authenticateToken, requireMasterAdmin, async (req, res) => {
  try {
    const user = await db.getAsync(
      `SELECT id, username, full_name, mobile_no, address, role,
              can_manage_admins, can_manage_events, can_manage_gallery,
              can_manage_pdfs, can_manage_notifications, is_active,
              created_at, last_login
       FROM admin_users
       WHERE id = ?`,
      [req.params.id]
    );

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching admin user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch admin user' 
    });
  }
});

// CREATE new admin user
router.post('/', authenticateToken, requireMasterAdmin, async (req, res) => {
  try {
    const {
      username,
      password,
      full_name,
      mobile_no,
      address,
      role = 'admin',
      can_manage_admins = 0,
      can_manage_events = 1,
      can_manage_gallery = 1,
      can_manage_pdfs = 1,
      can_manage_notifications = 1
    } = req.body;

    // Validation
    if (!username || !password || !full_name) {
      return res.status(400).json({ 
        success: false,
        error: 'Username, password, and full name are required' 
      });
    }

    // Check if username exists
    const existingUser = await db.getAsync(
      'SELECT id FROM admin_users WHERE username = ?',
      [username]
    );

    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'Username already exists' 
      });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Insert new admin
    const result = await db.runAsync(
      `INSERT INTO admin_users (
        username, password_hash, full_name, mobile_no, address, role,
        can_manage_admins, can_manage_events, can_manage_gallery,
        can_manage_pdfs, can_manage_notifications, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username, passwordHash, full_name, mobile_no, address, role,
        can_manage_admins, can_manage_events, can_manage_gallery,
        can_manage_pdfs, can_manage_notifications, 1
      ]
    );

    // Log activity
    await activityLogger.log(
      req.user.id,
      'CREATE_ADMIN',
      'admin_users',
      result.id,
      null,
      { username, full_name, role },
      req
    );

    res.status(201).json({
      success: true,
      id: result.id,
      message: 'Admin user created successfully'
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create admin user' 
    });
  }
});

// UPDATE admin user
router.put('/:id', authenticateToken, requireMasterAdmin, async (req, res) => {
  try {
    const {
      full_name,
      mobile_no,
      address,
      role,
      can_manage_admins,
      can_manage_events,
      can_manage_gallery,
      can_manage_pdfs,
      can_manage_notifications,
      is_active
    } = req.body;

    // Don't allow editing master admin
    const targetUser = await db.getAsync(
      'SELECT role FROM admin_users WHERE id = ?',
      [req.params.id]
    );

    if (!targetUser) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    if (targetUser.role === 'master_admin' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ 
        success: false,
        error: 'Cannot modify master admin' 
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (full_name !== undefined) {
      updates.push('full_name = ?');
      values.push(full_name);
    }
    if (mobile_no !== undefined) {
      updates.push('mobile_no = ?');
      values.push(mobile_no);
    }
    if (address !== undefined) {
      updates.push('address = ?');
      values.push(address);
    }
    if (role !== undefined && targetUser.role !== 'master_admin') {
      updates.push('role = ?');
      values.push(role);
    }
    if (can_manage_admins !== undefined) {
      updates.push('can_manage_admins = ?');
      values.push(can_manage_admins);
    }
    if (can_manage_events !== undefined) {
      updates.push('can_manage_events = ?');
      values.push(can_manage_events);
    }
    if (can_manage_gallery !== undefined) {
      updates.push('can_manage_gallery = ?');
      values.push(can_manage_gallery);
    }
    if (can_manage_pdfs !== undefined) {
      updates.push('can_manage_pdfs = ?');
      values.push(can_manage_pdfs);
    }
    if (can_manage_notifications !== undefined) {
      updates.push('can_manage_notifications = ?');
      values.push(can_manage_notifications);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No fields to update' 
      });
    }

    values.push(req.params.id);

    await db.runAsync(
      `UPDATE admin_users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Log activity
    await activityLogger.log(
      req.user.id,
      'UPDATE_ADMIN',
      'admin_users',
      req.params.id,
      targetUser,
      req.body,
      req
    );

    res.json({
      success: true,
      message: 'Admin user updated successfully'
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update admin user' 
    });
  }
});

// RESET password (master admin can reset any user's password)
router.post('/:id/reset-password', authenticateToken, requireMasterAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'Password must be at least 6 characters' 
      });
    }

    const targetUser = await db.getAsync(
      'SELECT username, role FROM admin_users WHERE id = ?',
      [req.params.id]
    );

    if (!targetUser) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPassword, salt);

    await db.runAsync(
      'UPDATE admin_users SET password_hash = ? WHERE id = ?',
      [passwordHash, req.params.id]
    );

    // Log activity
    await activityLogger.log(
      req.user.id,
      'RESET_PASSWORD',
      'admin_users',
      req.params.id,
      null,
      { username: targetUser.username },
      req
    );

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to reset password' 
    });
  }
});

// DELETE admin user (soft delete by deactivating)
router.delete('/:id', authenticateToken, requireMasterAdmin, async (req, res) => {
  try {
    const targetUser = await db.getAsync(
      'SELECT role FROM admin_users WHERE id = ?',
      [req.params.id]
    );

    if (!targetUser) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Prevent deleting master admin
    if (targetUser.role === 'master_admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Cannot delete master admin' 
      });
    }

    // Soft delete (deactivate)
    await db.runAsync(
      'UPDATE admin_users SET is_active = 0 WHERE id = ?',
      [req.params.id]
    );

    // Log activity
    await activityLogger.log(
      req.user.id,
      'DELETE_ADMIN',
      'admin_users',
      req.params.id,
      targetUser,
      { is_active: 0 },
      req
    );

    res.json({
      success: true,
      message: 'Admin user deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete admin user' 
    });
  }
});

// HARD DELETE (permanent - master admin only)
router.delete('/:id/permanent', authenticateToken, requireMasterAdmin, async (req, res) => {
  try {
    const targetUser = await db.getAsync(
      'SELECT role FROM admin_users WHERE id = ?',
      [req.params.id]
    );

    if (!targetUser) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Prevent deleting master admin
    if (targetUser.role === 'master_admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Cannot delete master admin' 
      });
    }

    // Permanently delete
    await db.runAsync('DELETE FROM admin_users WHERE id = ?', [req.params.id]);

    // Log activity
    await activityLogger.log(
      req.user.id,
      'HARD_DELETE_ADMIN',
      'admin_users',
      req.params.id,
      targetUser,
      null,
      req
    );

    res.json({
      success: true,
      message: 'Admin user permanently deleted'
    });
  } catch (error) {
    console.error('Error hard deleting admin user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete admin user' 
    });
  }
});

module.exports = router;