const express = require('express');
const { body, validationResult } = require('express-validator');
const Unemployed = require('../models/unemployed.js');
const Person = require('../models/person.js');
const { protect, admin } = require('../middleware/auth.js');
const db = require('../db.js');
const router = express.Router();

// GET /api/unemployed - admin list all
router.get('/', protect, admin, async (req, res) => {
  try {
    // Get all with person join
    const query = `
      SELECT u.*, p.name, p.user_id 
      FROM unemployed u JOIN person p ON u.person_id = p.id
      ORDER BY u.created_at DESC
    `;
    const { rows } = await db.query(query); // Note: use db or add model
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unemployed graduates' });
  }
});

// GET /api/unemployed/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const unemployed = await Unemployed.getByPersonId(req.params.id);
    if (!unemployed) return res.status(404).json({ error: 'Not found' });
    res.json(unemployed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// POST /api/unemployed
router.post('/', protect, [
  body('person_id').isInt(),
  body('field_of_study').notEmpty(),
  body('education_level_id').isInt(),
  body('graduation_year').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { person_id, field_of_study, education_level_id, graduation_year } = req.body;
    
    // Check ownership
    const person = await Person.getById(person_id);
    if (!person || (person.user_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const unemployed = await Unemployed.create(person_id, field_of_study, education_level_id, graduation_year);
    res.status(201).json(unemployed);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/unemployed/:person_id
router.put('/:person_id', protect, [
  body('field_of_study').optional().notEmpty(),
  body('education_level_id').optional().isInt(),
  body('graduation_year').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const person_id = req.params.person_id;
    const { field_of_study, education_level_id, graduation_year } = req.body;
    
    const person = await Person.getById(person_id);
    if (!person || person.type !== 'unemployed_graduate') return res.status(404).json({ error: 'Unemployed profile not found' });
    if (person.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const updated = await Unemployed.update(person_id, field_of_study, parseInt(education_level_id), parseInt(graduation_year));
    if (!updated) return res.status(404).json({ error: 'Unemployed record not found' });
    
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

