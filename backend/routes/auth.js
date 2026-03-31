const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const db = require('../db.js');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'nation_secret_key_change_me';
const ALLOW_DEMO_ADMIN = process.env.ALLOW_DEMO_ADMIN === 'true';

// POST /api/auth/register
router.post('/register', [
  body('username').isLength({ min: 3 }).withMessage('Username min 3 chars'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check duplicates
    const existingUser = await User.findByUsername(username) || await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const user = await User.create(username, email, password);
    res.status(201).json({ message: 'User registered', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('username').notEmpty(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await User.findByUsername(username) || await User.findByEmail(username);
    if (!user || !(await User.comparePassword(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isDefaultDemoAdmin =
      user.role === 'admin' &&
      user.username === 'admin' &&
      user.email === 'admin@nation.et' &&
      password === 'password123';

    if (isDefaultDemoAdmin && !ALLOW_DEMO_ADMIN) {
      return res.status(403).json({ error: 'Default demo admin access is disabled. Use a private admin account.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me (protected)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid token' });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Token invalid/expired' });
  }
});

module.exports = router;
