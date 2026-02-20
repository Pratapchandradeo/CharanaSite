const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// ========== PUBLIC ROUTES ==========

// GET all active events
router.get('/', async (req, res) => {
  try {
    const events = await db.allAsync(
      `SELECT id, title, title_en, date, date_en, time, time_en, 
              description, description_en, image_path 
       FROM events 
       WHERE is_active = 1 
       ORDER BY display_order ASC, created_at DESC`
    );
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await db.getAsync(
      'SELECT * FROM events WHERE id = ? AND is_active = 1',
      [req.params.id]
    );
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

module.exports = router;