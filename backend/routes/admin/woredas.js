const express = require('express');
const Woreda = require('../../models/woreda.js');
const { protect, admin } = require('../../middleware/auth.js');

const router = express.Router();

// GET /api/admin/woredas
router.get('/', protect, admin, async (req, res) => {
  try {
    const woredas = await Woreda.getAll();
    res.json(woredas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch woredas' });
  }
});

// POST /api/admin/woredas
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const woreda = await Woreda.create(name);
    res.status(201).json(woreda);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/admin/woredas/:id
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const woreda = await Woreda.update(req.params.id, name);
    if (!woreda) return res.status(404).json({ error: 'Woreda not found' });
    res.json(woreda);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/woredas/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const woreda = await Woreda.delete(req.params.id);
    if (!woreda) return res.status(404).json({ error: 'Woreda not found' });
    res.json({ message: 'Woreda deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete woreda' });
  }
});

module.exports = router;
