const db = require('../db.js');

const Worker = {
create: async (personId, professionId, department, educationLevelId, organization_id, field_of_study) => {
    const query = `
      INSERT INTO worker (person_id, profession_id, department, education_level_id, organization_id, field_of_study) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const { rows } = await db.query(query, [personId, professionId, department, educationLevelId, organization_id, field_of_study]);
    return rows[0];
  },

  getAll: async () => {
    const query = `
      SELECT w.*, p.name as person_name, p.type, p.phone, 
             wore.name as woreda_name, vil.name as village_name,
             prof.name as profession_name, el.name as education_level_name,
             org.name as organization_name
      FROM worker w
      JOIN person p ON w.person_id = p.id
      JOIN woreda wore ON p.woreda_id = wore.id
      JOIN village vil ON p.village_id = vil.id
      JOIN profession prof ON w.profession_id = prof.id
      LEFT JOIN education_level el ON w.education_level_id = el.id
      LEFT JOIN organization org ON w.organization_id = org.id
      ORDER BY w.created_at DESC
    `;
    const { rows } = await db.query(query);
    return rows;
  },

  getById: async (id) => {
    const query = `
      SELECT w.*, p.name as person_name, 
             wore.name as woreda_name, vil.name as village_name,
             prof.name as profession_name, el.name as education_level_name,
             org.name as organization_name
      FROM worker w JOIN person p ON w.person_id = p.id
      JOIN woreda wore ON p.woreda_id = wore.id 
      JOIN village vil ON p.village_id = vil.id
      JOIN profession prof ON w.profession_id = prof.id
      LEFT JOIN education_level el ON w.education_level_id = el.id
      LEFT JOIN organization org ON w.organization_id = org.id
      WHERE w.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  getByPersonId: async (personId) => {
    const query = 'SELECT * FROM worker WHERE person_id = $1';
    const { rows } = await db.query(query, [personId]);
    return rows[0];
  },

update: async (id, personId, professionId, department, educationLevelId, organization_id, field_of_study) => {
    const query = `
      UPDATE worker SET person_id = $1, profession_id = $2, department = $3,
      education_level_id = $4, organization_id = $5, field_of_study = $6 WHERE id = $7 RETURNING *
    `;
    const { rows } = await db.query(query, [personId, professionId, department, educationLevelId, organization_id, field_of_study, id]);
    return rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM worker WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
};

module.exports = Worker;
