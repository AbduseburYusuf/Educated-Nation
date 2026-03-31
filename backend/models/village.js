const db = require('../db.js');

const Village = {
  create: async (name, woredaId) => {
    const query = `
      INSERT INTO village (name, woreda_id) 
      VALUES ($1, $2) RETURNING *
    `;
    const { rows } = await db.query(query, [name, woredaId]);
    return rows[0];
  },

  getAll: async (woredaId = null) => {
    let query = 'SELECT v.*, w.name as woreda_name FROM village v JOIN woreda w ON v.woreda_id = w.id';
    const params = [];
    if (woredaId) {
      query += ' WHERE v.woreda_id = $1';
      params.push(woredaId);
    }
    query += ' ORDER BY v.name';
    const { rows } = await db.query(query, params);
    return rows;
  },

  getById: async (id) => {
    const query = `
      SELECT v.*, w.name as woreda_name 
      FROM village v JOIN woreda w ON v.woreda_id = w.id 
      WHERE v.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  update: async (id, name, woredaId) => {
    const query = `
      UPDATE village SET name = $1, woreda_id = $2 WHERE id = $3 RETURNING *
    `;
    const { rows } = await db.query(query, [name, woredaId, id]);
    return rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM village WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
};

module.exports = Village;

