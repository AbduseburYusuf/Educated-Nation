const db = require('../db.js');

const Student = {
create: async (personId, level, grade_or_year, field_of_study, education_level_id, institution_name) => {
    const query = `
      INSERT INTO student (person_id, level, grade_or_year, field_of_study, education_level_id, institution_name) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const { rows } = await db.query(query, [personId, level, grade_or_year, field_of_study, education_level_id, institution_name]);
    return rows[0];
  },

  getAll: async () => {
    const query = `
      SELECT s.*, p.name as person_name, p.type, 
             w.name as woreda_name, v.name as village_name,
             el.name as education_level_name
      FROM student s
      JOIN person p ON s.person_id = p.id
      JOIN woreda w ON p.woreda_id = w.id
      JOIN village v ON p.village_id = v.id
      LEFT JOIN education_level el ON s.education_level_id = el.id
      ORDER BY s.created_at DESC
    `;
    const { rows } = await db.query(query);
    return rows;
  },

  getById: async (id) => {
    const query = `
      SELECT s.*, p.name as person_name, 
             w.name as woreda_name, v.name as village_name,
             el.name as education_level_name
      FROM student s JOIN person p ON s.person_id = p.id
      JOIN woreda w ON p.woreda_id = w.id JOIN village v ON p.village_id = v.id
      LEFT JOIN education_level el ON s.education_level_id = el.id
      WHERE s.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  getByPersonId: async (personId) => {
    const query = 'SELECT * FROM student WHERE person_id = $1';
    const { rows } = await db.query(query, [personId]);
    return rows[0];
  },

  update: async (id, personId, level, grade_or_year, field_of_study, education_level_id, institution_name) => {
    const query = `
      UPDATE student SET person_id = $1, level = $2, grade_or_year = $3, field_of_study = $4, 
      education_level_id = $5, institution_name = $6 WHERE id = $7 RETURNING *
    `;
    const { rows } = await db.query(query, [personId, level, grade_or_year, field_of_study, education_level_id, institution_name, id]);
    return rows[0];
  },

  delete: async (id) => {
    const query = 'DELETE FROM student WHERE id = $1 RETURNING id';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
};

module.exports = Student;

