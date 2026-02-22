const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { authenticateToken } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// ================= FILE UPLOAD =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ================= ADMIN ROUTES =================

// GET all events (admin)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    const events = await db.allAsync(`
      SELECT * FROM events
      ORDER BY created_at DESC
    `);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// CREATE event
router.post('/admin', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, date, time, description, contact } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await db.runAsync(
      `INSERT INTO events 
       (title, date, time, description, contact, image_path, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [title, date, time, description, contact, imagePath]
    );

    res.json({ id: result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// UPDATE event
router.put('/admin/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, date, time, description, contact } = req.body;

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    await db.runAsync(
      `UPDATE events 
       SET title=?, date=?, time=?, description=?, contact=?,
           image_path=COALESCE(?, image_path)
       WHERE id=?`,
      [title, date, time, description, contact, imagePath, req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE event
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    await db.runAsync(`DELETE FROM events WHERE id=?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// ================= PUBLIC ROUTES =================

// GET active events
router.get('/', async (req, res) => {
  try {
    const events = await db.allAsync(
      `SELECT * FROM events WHERE is_active = 1 ORDER BY created_at DESC`
    );
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await db.getAsync(
      `SELECT * FROM events WHERE id = ?`,
      [req.params.id]
    );
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

module.exports = router;
