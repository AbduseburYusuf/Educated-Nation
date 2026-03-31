const express = require('express');
const Organization = require('../../models/organization.js');
const { protect, admin } = require('../../middleware/auth.js');

const router = express.Router();

// GET /api/admin/organizations
router.get('/', protect, admin, async (req, res) => {
  try {
    const organizations = await Organization.getAll();
    res.json(organizations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

// POST /api/admin/organizations
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const organization = await Organization.create(name);
    res.status(201).json(organization);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/admin/organizations/:id
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const organization = await Organization.update(req.params.id, name);
    if (!organization) return res.status(404).json({ error: 'Organization not found' });
    res.json(organization);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/admin/organizations/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const organization = await Organization.delete(req.params.id);
    if (!organization) return res.status(404).json({ error: 'Organization not found' });
    res.json({ message: 'Organization deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete organization' });
  }
});

module.exports = router;

