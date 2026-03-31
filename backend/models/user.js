const db = require('../db.js');
const bcrypt = require('bcryptjs');

const User = {
  create: async (username, email, password, role = 'user') => {
    const password_hash = await bcrypt.hash(password, 12);
    const query = `
      INSERT INTO users (username, email, password_hash, role) 
      VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at
    `;
    const { rows } = await db.query(query, [username, email, password_hash, role]);
    return rows[0];
  },

  findByUsername: async (username) => {
    const query = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await db.query(query, [username]);
    return rows[0];
  },

  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0];
  },

  findById: async (id) => {
    const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  getAll: async () => {
    const query = 'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC';
    const { rows } = await db.query(query);
    return rows;
  },

  comparePassword: async (password, hash) => {
    return bcrypt.compare(password, hash);
  }
};

module.exports = User;
