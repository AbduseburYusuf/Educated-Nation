const express = require('express');
const { body, validationResult } = require('express-validator');
const Worker = require('../models/worker.js');
const Person = require('../models/person.js');
const { protect, admin } = require('../middleware/auth.js');
const router = express.Router();

// GET /api/workers - admin only
router.get('/', protect, admin, async (req, res) => {
  try {
    const workers = await Worker.getAll();
    res.json(workers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

// GET /api/workers/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const worker = await Worker.getByPersonId(req.params.id);
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch worker' });
  }
});

// POST /api/workers
router.post('/', protect, [
  body('person_id').isInt(),
  body('profession_id').isInt(),
  body('education_level_id').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { person_id, profession_id, department, education_level_id, organization_id, field_of_study } = req.body;
    
    // Ownership check
    const person = await Person.getById(person_id);
    if (!person || (person.user_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const worker = await Worker.create(person_id, profession_id, department, education_level_id, organization_id, field_of_study);
    res.status(201).json(worker);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/workers/:person_id
router.put('/:person_id', protect, [
  body('profession_id').optional().isInt(),
  body('education_level_id').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const person_id = req.params.person_id;
    const { profession_id, department, education_level_id, organization_id, field_of_study } = req.body;
    
    const person = await Person.getById(person_id);
    if (!person || person.type !== 'worker') return res.status(404).json({ error: 'Worker profile not found' });
    if (person.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const existing = await Worker.getByPersonId(person_id);
    if (!existing) return res.status(404).json({ error: 'Worker record not found' });
    
    const updated = await Worker.update(
      existing.id, person_id, parseInt(profession_id), department || null, parseInt(education_level_id),
      organization_id ? parseInt(organization_id) : null, field_of_study
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
