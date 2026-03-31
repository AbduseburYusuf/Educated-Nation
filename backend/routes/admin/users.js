const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../../db.js');
const User = require('../../models/user.js');
const { protect, admin } = require('../../middleware/auth.js');

const router = express.Router();

// GET /api/admin/users - get all users (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/admin/users - create a user (admin only)
router.post('/', protect, admin, [
  body('username').isLength({ min: 3 }).withMessage('Username min 3 chars'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role = 'user' } = req.body;
    const existingUser = await User.findByUsername(username) || await User.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const user = await User.create(username, email, password, role);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PATCH /api/admin/users/:id/role - toggle user role (admin only)
router.patch('/:id/role', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id === parseInt(id, 10)) {
      return res.status(400).json({ error: 'You cannot change your own role from this screen' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const query = 'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role';
    const { rows } = await db.query(query, [newRole, id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// DELETE /api/admin/users/:id - remove user (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id === parseInt(id, 10)) {
      return res.status(400).json({ error: 'You cannot delete your own account from this screen' });
    }

    const query = 'DELETE FROM users WHERE id = $1 RETURNING id, username';
    const { rows } = await db.query(query, [id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted', user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
