const express = require('express');
const db = require('../../db.js');
const Village = require('../../models/village.js');
const { protect, admin } = require('../../middleware/auth.js');

const router = express.Router();

// GET /api/admin/villages - admin list all
router.get('/', protect, admin, async (req, res) => {
  try {
    const villages = await Village.getAll(req.query.woreda_id);
    res.json(villages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch villages' });
  }
});

// POST /api/admin/villages - admin create
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, woreda_id } = req.body;
    if (!name || !woreda_id) {
      return res.status(400).json({ error: 'Name and woreda_id required' });
    }
    const village = await Village.create(name, woreda_id);
    res.status(201).json(village);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/admin/villages/:id - admin update
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, woreda_id } = req.body;
    const village = await Village.getById(req.params.id);
    if (!village) return res.status(404).json({ error: 'Village not found' });
    const updated = await Village.update(req.params.id, name, woreda_id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/villages/:id - admin delete
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const village = await Village.delete(req.params.id);
    if (!village) return res.status(404).json({ error: 'Village not found' });
    res.json({ message: 'Village deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete village' });
  }
});

module.exports = router;

