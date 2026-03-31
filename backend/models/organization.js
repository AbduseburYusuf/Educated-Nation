const db = require('../db.js');

const Organization = {
  create: async (name) => {
    const query = `
      INSERT INTO organization (name) 
      VALUES ($1) RETURNING *
    `;
    const { rows } = await db.query(query, [name]);
    return rows[0];
  },

  getAll: async () => {
    const query = 'SELECT * FROM organization ORDER BY name';
    const { rows } = await db.query(query);
    return rows;
  },

  getById: async (id) => {
    const query = 'SELECT * FROM organization WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  update: async (id, name) => {
    const query = 'UPDATE organization SET name = $1 WHERE id = $2 RETURNING *';
    const { rows } = await db.query(query, [name, id]);
    return rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM organization WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
};

module.exports = Organization;
