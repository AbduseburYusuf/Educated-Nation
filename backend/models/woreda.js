const db = require('../db.js');

const Woreda = {
  // Create woreda
  create: async (name) => {
    const query = `
      INSERT INTO woreda (name) 
      VALUES ($1) RETURNING *
    `;
    const { rows } = await db.query(query, [name]);
    return rows[0];
  },

  // Get all woredas
  getAll: async () => {
    const { rows } = await db.query('SELECT * FROM woreda ORDER BY name');
    return rows;
  },

  // Get by ID
  getById: async (id) => {
    const query = 'SELECT * FROM woreda WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  // Update
  update: async (id, name) => {
    const query = `
      UPDATE woreda SET name = $1 WHERE id = $2 RETURNING *
    `;
    const { rows } = await db.query(query, [name, id]);
    return rows[0];
  },

  // Delete
  delete: async (id) => {
    const query = 'DELETE FROM woreda WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
};

module.exports = Woreda;

