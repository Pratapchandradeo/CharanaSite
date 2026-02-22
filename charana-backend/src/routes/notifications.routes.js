const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authenticateToken } = require('../middleware/auth.middleware');
const activityLogger = require('../utils/activityLogger');

// ========== PUBLIC ROUTES ==========

// GET all active notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await db.allAsync(
      'SELECT id, message, type FROM notifications WHERE is_active = 1 ORDER BY display_order ASC, created_at DESC'
    );
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// GET single notification (public - for viewing)
router.get('/:id', async (req, res) => {
  try {
    const notification = await db.getAsync(
      'SELECT * FROM notifications WHERE id = ?',
      [req.params.id]
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({ error: 'Failed to fetch notification' });
  }
});

// ========== ADMIN ROUTES (Protected) ==========

// GET all notifications (including inactive) for admin
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const notifications = await db.allAsync(
      `SELECT n.*, 
              creator.username as created_by_username,
              updater.username as updated_by_username
       FROM notifications n
       LEFT JOIN admin_users creator ON n.created_by = creator.id
       LEFT JOIN admin_users updater ON n.updated_by = updater.id
       ORDER BY n.created_at DESC`
    );
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// CREATE notification
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message, type, display_order = 0 } = req.body;
    
    if (!message || !type) {
      return res.status(400).json({ error: 'Message and type are required' });
    }

    const result = await db.runAsync(
      `INSERT INTO notifications (message, type, display_order, created_by, updated_by) 
       VALUES (?, ?, ?, ?, ?)`,
      [message, type, display_order, req.user.id, req.user.id]
    );

    // Log activity
    await activityLogger.log(
      req.user.id,
      'CREATE',
      'notification',
      result.id,
      null,
      { message, type, display_order },
      req
    );

    res.status(201).json({
      success: true,
      id: result.id,
      message: 'Notification created successfully'
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// UPDATE notification
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { message, type, is_active, display_order } = req.body;
    
    // Get old values for audit
    const oldNotification = await db.getAsync(
      'SELECT * FROM notifications WHERE id = ?',
      [req.params.id]
    );
    
    if (!oldNotification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await db.runAsync(
      `UPDATE notifications 
       SET message = COALESCE(?, message),
           type = COALESCE(?, type),
           is_active = COALESCE(?, is_active),
           display_order = COALESCE(?, display_order),
           updated_at = CURRENT_TIMESTAMP,
           updated_by = ?
       WHERE id = ?`,
      [message, type, is_active, display_order, req.user.id, req.params.id]
    );

    // Log activity
    await activityLogger.log(
      req.user.id,
      'UPDATE',
      'notification',
      req.params.id,
      oldNotification,
      { message, type, is_active, display_order },
      req
    );

    res.json({
      success: true,
      message: 'Notification updated successfully'
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// DELETE notification (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const notification = await db.getAsync(
      'SELECT * FROM notifications WHERE id = ?',
      [req.params.id]
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Soft delete
    await db.runAsync(
      'UPDATE notifications SET is_active = 0, updated_by = ? WHERE id = ?',
      [req.user.id, req.params.id]
    );

    // Log activity
    await activityLogger.log(
      req.user.id,
      'DELETE',
      'notification',
      req.params.id,
      notification,
      { is_active: 0 },
      req
    );

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// HARD DELETE (permanent - master admin only)
router.delete('/:id/permanent', authenticateToken, async (req, res) => {
  // Check if user is master admin
  if (req.user.role !== 'master_admin') {
    return res.status(403).json({ error: 'Master admin access required' });
  }

  try {
    const notification = await db.getAsync(
      'SELECT * FROM notifications WHERE id = ?',
      [req.params.id]
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await db.runAsync('DELETE FROM notifications WHERE id = ?', [req.params.id]);

    // Log activity
    await activityLogger.log(
      req.user.id,
      'HARD_DELETE',
      'notification',
      req.params.id,
      notification,
      null,
      req
    );

    res.json({
      success: true,
      message: 'Notification permanently deleted'
    });
  } catch (error) {
    console.error('Error hard deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

module.exports = router;