const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// GET all active PDFs (public)
router.get('/', async (req, res) => {
  try {
    const pdfs = await db.allAsync(
      `SELECT id, title, title_en, file_path, file_size, description 
       FROM pdf_documents 
       WHERE is_active = 1 
       ORDER BY display_order ASC, uploaded_at DESC`
    );
    res.json(pdfs);
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ error: 'Failed to fetch PDFs' });
  }
});

// GET single PDF
router.get('/:id', async (req, res) => {
  try {
    const pdf = await db.getAsync(
      'SELECT * FROM pdf_documents WHERE id = ?',
      [req.params.id]
    );
    
    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    
    res.json(pdf);
  } catch (error) {
    console.error('Error fetching PDF:', error);
    res.status(500).json({ error: 'Failed to fetch PDF' });
  }
});

module.exports = router;