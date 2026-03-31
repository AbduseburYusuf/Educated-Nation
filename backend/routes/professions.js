const express = require('express');
const Profession = require('../models/profession.js');
const router = express.Router();

// GET /api/professions
router.get('/', async (req, res) => {
  try {
    const professions = await Profession.getAll();
    res.json(professions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch professions' });
  }
});

// POST /api/professions - similar to woredas
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const profession = await Profession.create(name);
    res.status(201).json(profession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

