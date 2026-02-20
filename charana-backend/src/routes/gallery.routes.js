const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// GET all active gallery images (public)
router.get('/', async (req, res) => {
  try {
    const images = await db.allAsync(
      `SELECT id, title, title_en, image_path, thumbnail_path 
       FROM gallery_images 
       WHERE is_active = 1 AND is_archived = 0
       ORDER BY display_order ASC, uploaded_at DESC`
    );
    res.json(images);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// GET single image
router.get('/:id', async (req, res) => {
  try {
    const image = await db.getAsync(
      'SELECT * FROM gallery_images WHERE id = ?',
      [req.params.id]
    );
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Update access count
    await db.runAsync(
      'UPDATE gallery_images SET access_count = access_count + 1, last_accessed = CURRENT_TIMESTAMP WHERE id = ?',
      [req.params.id]
    );
    
    res.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

module.exports = router;