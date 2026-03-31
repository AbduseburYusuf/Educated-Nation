const express = require('express');
const Woreda = require('../models/woreda.js');
const router = express.Router();

// GET /api/woredas
router.get('/', async (req, res) => {
  try {
    const woredas = await Woreda.getAll();
    res.json(woredas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch woredas' });
  }
});

// POST /api/woredas
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const woreda = await Woreda.create(name);
    res.status(201).json(woreda);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// For other CRUD...
router.get('/:id', async (req, res) => {
  try {
    const woreda = await Woreda.getById(req.params.id);
    if (!woreda) return res.status(404).json({ error: 'Woreda not found' });
    res.json(woreda);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch woreda' });
  }
});

// PUT, DELETE similar pattern...

module.exports = router;

