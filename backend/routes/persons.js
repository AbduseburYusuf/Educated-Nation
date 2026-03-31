const express = require('express');
const { body, validationResult } = require('express-validator');
const Person = require('../models/person.js');
const db = require('../db.js');
const { protect } = require('../middleware/auth.js');
const router = express.Router();

// GET /api/persons - admin list all w/ optional status filter (protected)
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    let query = `
      SELECT p.*, u.username, 
             w.name as woreda_name, 
             v.name as village_name, p.status
      FROM person p
      LEFT JOIN users u ON p.user_id = u.id
      JOIN woreda w ON p.woreda_id = w.id
      JOIN village v ON p.village_id = v.id
    `;
    const params = [];
    if (req.query.status) {
      query += ' WHERE p.status = $1';
      params.push(req.query.status);
    }
    query += ' ORDER BY p.created_at DESC';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch persons' });
  }
});

// GET /api/persons/my-profile (user's profile)
router.get('/my-profile', protect, async (req, res) => {
  try {
    const person = await Person.getByUserId(req.user.id);
    res.json(person || null);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// GET /api/persons/:id (protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const person = await Person.getById(req.params.id);
    if (!person) return res.status(404).json({ error: 'Person not found' });
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch person' });
  }
});

// POST /api/persons (user personal info, once)
router.post('/', protect, [
  body('name').notEmpty().withMessage('Name required'),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('birth_date').optional().isDate(),
  body('woreda_id').isInt().withMessage('Valid woreda_id required'),
  body('village_id').isInt().withMessage('Valid village_id required'),
  body('type').isIn(['student', 'worker', 'unemployed_graduate']).withMessage('Invalid type'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone required'),
  body('national_id').optional().isLength({ min: 5 }).withMessage('National ID min 5 chars')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, gender, birth_date, phone, national_id, woreda_id, village_id, type } = req.body;

    // User-specific + global duplicate check
    const dupe = await Person.checkDuplicatePerson(req.user.id, phone, national_id);
    if (dupe) {
      return res.status(400).json({ error: dupe.error });
    }

    const person = await Person.create(
      req.user.id, name, gender, birth_date, phone, national_id, woreda_id, village_id, type
    );
    res.status(201).json(person);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/persons/:id (edit own profile)
router.put('/:id', protect, [
  body('name').notEmpty(),
  body('gender').optional().isIn(['male','female','other']),
  body('birth_date').optional().isDate(),
  body('woreda_id').isInt(),
  body('village_id').isInt(),
  body('type').isIn(['student','worker','unemployed_graduate'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const person = await Person.getById(req.params.id);
    if (!person) return res.status(404).json({ error: 'Person not found' });
    if (person.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { name, gender, birth_date, phone, national_id, woreda_id, village_id, type } = req.body;
    const updated = await Person.update(
      req.params.id, person.user_id, name, gender, birth_date, phone, national_id, woreda_id, village_id, type
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/persons/:id/approve (admin only)
router.patch('/:id/approve', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const query = 'UPDATE person SET status = \'approved\' WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Person not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve' });
  }
});

// PATCH /api/persons/:id/reject (admin only)
router.patch('/:id/reject', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const query = 'UPDATE person SET status = \'rejected\' WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Person not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject' });
  }
});

// DELETE /api/persons/:id (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }
    const person = await Person.delete(req.params.id);
    if (!person) return res.status(404).json({ error: 'Person not found' });
    res.json({ message: 'Person deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete person' });
  }
});

module.exports = router;
