const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// GET all active notifications (public)
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

// GET single notification
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

module.exports = router;