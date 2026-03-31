const db = require('../db.js');

const Unemployed = {
  create: async (personId, fieldOfStudy, educationLevelId, graduationYear) => {
    const query = `
      INSERT INTO unemployed (person_id, field_of_study, education_level_id, graduation_year)
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const { rows } = await db.query(query, [personId, fieldOfStudy, educationLevelId, graduationYear]);
    return rows[0];
  },

  getByPersonId: async (personId) => {
    const query = 'SELECT * FROM unemployed WHERE person_id = $1';
    const { rows } = await db.query(query, [personId]);
    return rows[0];
  },

  update: async (personId, fieldOfStudy, educationLevelId, graduationYear) => {
    const query = `
      UPDATE unemployed SET field_of_study = $1, education_level_id = $2, graduation_year = $3
      WHERE person_id = $4 RETURNING *
    `;
    const { rows } = await db.query(query, [fieldOfStudy, educationLevelId, graduationYear, personId]);
    return rows[0];
  },

  delete: async (personId) => {
    const query = 'DELETE FROM unemployed WHERE person_id = $1 RETURNING person_id';
    const { rows } = await db.query(query, [personId]);
    return rows[0];
  }
};

module.exports = Unemployed;

