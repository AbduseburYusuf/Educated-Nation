const db = require('../db.js');

const Profession = {
  create: async (name) => {
    const query = `
      INSERT INTO profession (name) 
      VALUES ($1) RETURNING *
    `;
    const { rows } = await db.query(query, [name]);
    return rows[0];
  },

  getAll: async () => {
    const { rows } = await db.query('SELECT * FROM profession ORDER BY name');
    return rows;
  },

  getById: async (id) => {
    const query = 'SELECT * FROM profession WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  update: async (id, name) => {
    const query = `
      UPDATE profession SET name = $1 WHERE id = $2 RETURNING *
    `;
    const { rows } = await db.query(query, [name, id]);
    return rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM profession WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
};

module.exports = Profession;

