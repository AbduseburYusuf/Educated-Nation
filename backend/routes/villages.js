const express = require('express');
const Village = require('../models/village.js');
const router = express.Router();

// GET /api/villages
router.get('/', async (req, res) => {
  try {
    const villages = await Village.getAll();
    res.json(villages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch villages' });
  }
});

// POST /api/villages
router.post('/', async (req, res) => {
  try {
    const { name, woreda_id } = req.body;
    if (!name || !woreda_id) return res.status(400).json({ error: 'Name and woreda_id required' });
    const village = await Village.create(name, woreda_id);
    res.status(201).json(village);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Other CRUD...

module.exports = router;

