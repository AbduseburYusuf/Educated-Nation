const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/student.js');
const Person = require('../models/person.js');
const { protect, admin } = require('../middleware/auth.js');
const db = require('../db.js');
const router = express.Router();

// GET /api/students - admin only
router.get('/', protect, admin, async (req, res) => {
  try {
    const query = `
      SELECT s.*, p.name, p.user_id, w.name as woreda_name, v.name as village_name
      FROM student s JOIN person p ON s.person_id = p.id
      LEFT JOIN woreda w ON p.woreda_id = w.id
      LEFT JOIN village v ON p.village_id = v.id
      ORDER BY s.created_at DESC
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET /api/students/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.getByPersonId(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// POST /api/students
router.post('/', protect, [
  body('person_id').isInt(),
  body('level').isIn(['Grade 9-12', 'College', 'University']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const { person_id, level, grade_or_year, field_of_study, education_level_id, institution_name } = req.body;
    
    // Ownership check
    const person = await Person.getById(person_id);
    if (!person || (person.user_id !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const student = await Student.create(person_id, level, grade_or_year, field_of_study, education_level_id, institution_name);
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/students/:person_id
router.put('/:person_id', protect, [
  body('level').optional().isIn(['Grade 9-12', 'College', 'University']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    const person_id = req.params.person_id;
    const { level, grade_or_year, field_of_study, education_level_id, institution_name } = req.body;
    
    // Ownership check
    const person = await Person.getById(person_id);
    if (!person || person.type !== 'student') return res.status(404).json({ error: 'Student profile not found' });
    if (person.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const existing = await Student.getByPersonId(person_id);
    if (!existing) return res.status(404).json({ error: 'Student record not found' });
    
    const updated = await Student.update(
      existing.id, person_id, level, grade_or_year, field_of_study, 
      education_level_id ? parseInt(education_level_id) : null, institution_name
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

