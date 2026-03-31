const express = require('express');
const Profession = require('../../models/profession.js');
const { protect, admin } = require('../../middleware/auth.js');

const router = express.Router();

// GET /api/admin/professions
router.get('/', protect, admin, async (req, res) => {
  try {
    const professions = await Profession.getAll();
    res.json(professions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch professions' });
  }
});

// POST /api/admin/professions
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const profession = await Profession.create(name);
    res.status(201).json(profession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/admin/professions/:id
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const profession = await Profession.update(req.params.id, name);
    if (!profession) return res.status(404).json({ error: 'Profession not found' });
    res.json(profession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/professions/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const profession = await Profession.delete(req.params.id);
    if (!profession) return res.status(404).json({ error: 'Profession not found' });
    res.json({ message: 'Profession deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete profession' });
  }
});

module.exports = router;

