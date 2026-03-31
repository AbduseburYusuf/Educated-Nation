const db = require('../db.js');

const Person = {
  // Enhanced duplicate check: per phone/national_id AND per user_id
  checkDuplicatePerson: async (userId, phone, national_id) => {
    // Check if user already has a person record
    if (userId) {
      const userQuery = 'SELECT id FROM person WHERE user_id = $1';
      const { rows: userRows } = await db.query(userQuery, [userId]);
      if (userRows.length > 0) return { error: 'User already submitted personal information' };
    }
    // Check global phone/national_id duplicates
    if (phone) {
      const phoneQuery = 'SELECT id FROM person WHERE phone = $1';
      const { rows: phoneRows } = await db.query(phoneQuery, [phone]);
      if (phoneRows.length > 0) return { error: 'Phone number already registered' };
    }
    if (national_id) {
      const natQuery = 'SELECT id FROM person WHERE national_id = $1';
      const { rows: natRows } = await db.query(natQuery, [national_id]);
      if (natRows.length > 0) return { error: 'National ID already registered' };
    }
    return false;
  },

create: async (userId, name, gender, birthDate, phone, national_id, woredaId, villageId, type, status = 'pending') => {
    const query = `
      INSERT INTO person (user_id, name, gender, birth_date, phone, national_id, woreda_id, village_id, type, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    `;
    const values = [userId, name, gender || null, birthDate || null, phone || null, national_id || null, woredaId, villageId, type, status];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  getAll: async () => {
    const query = `
      SELECT p.*, u.username, 
             w.name as woreda_name, 
             v.name as village_name
      FROM person p
      LEFT JOIN users u ON p.user_id = u.id
      JOIN woreda w ON p.woreda_id = w.id
      JOIN village v ON p.village_id = v.id
      ORDER BY p.created_at DESC
    `;
    const { rows } = await db.query(query);
    return rows;
  },

  getById: async (id) => {
    const query = `
      SELECT p.*, u.username, 
             w.name as woreda_name, 
             v.name as village_name
      FROM person p
      LEFT JOIN users u ON p.user_id = u.id
      JOIN woreda w ON p.woreda_id = w.id
      JOIN village v ON p.village_id = v.id
      WHERE p.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  getByUserId: async (userId) => {
    const query = `
      SELECT p.*, w.name as woreda_name, v.name as village_name
      FROM person p
      JOIN woreda w ON p.woreda_id = w.id
      JOIN village v ON p.village_id = v.id
      WHERE p.user_id = $1
    `;
    const { rows } = await db.query(query, [userId]);
    return rows[0];
  },

update: async (id, userId, name, gender, birthDate, phone, national_id, woredaId, villageId, type, status) => {
    const query = `
      UPDATE person SET 
        user_id = $1, name = $2, gender = $3, birth_date = $4, phone = $5, national_id = $6,
        woreda_id = $7, village_id = $8, type = $9, status = $10
      WHERE id = $11 RETURNING *
    `;
    const values = [userId, name, gender || null, birthDate || null, phone || null, national_id || null, woredaId, villageId, type, status || 'pending', id];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM person WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  getByWoreda: async (woredaId) => {
    const query = `
      SELECT p.*, w.name as woreda_name, v.name as village_name
      FROM person p JOIN woreda w ON p.woreda_id = w.id JOIN village v ON p.village_id = v.id
      WHERE w.id = $1 ORDER BY p.name
    `;
    const { rows } = await db.query(query, [woredaId]);
    return rows;
  }
};

module.exports = Person;

