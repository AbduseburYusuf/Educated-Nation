const express = require('express');
const EducationLevel = require('../models/education_level.js');
const router = express.Router();

// GET /api/education-levels
router.get('/', async (req, res) => {
  try {
    const levels = await EducationLevel.getAll();
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch education levels' });
  }
});

module.exports = router;

