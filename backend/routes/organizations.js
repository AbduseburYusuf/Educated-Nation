const express = require('express');
const Organization = require('../models/organization.js');
const router = express.Router();

// GET /api/organizations
router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.getAll();
    res.json(organizations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

// POST /api/organizations
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const organization = await Organization.create(name);
    res.status(201).json(organization);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/organizations/:id
router.get('/:id', async (req, res) => {
  try {
    const organization = await Organization.getById(req.params.id);
    if (!organization) return res.status(404).json({ error: 'Organization not found' });
    res.json(organization);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch organization' });
  }
});

// PUT /api/organizations/:id
router.put('/:id', async (req, res) => {
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

// DELETE /api/organizations/:id
router.delete('/:id', async (req, res) => {
  try {
    const organization = await Organization.delete(req.params.id);
    if (!organization) return res.status(404).json({ error: 'Organization not found' });
    res.json({ message: 'Organization deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete organization' });
  }
});

module.exports = router;
