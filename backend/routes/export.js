const express = require('express');
const { Parser } = require('json2csv');
const db = require('../db.js');
const { protect, admin } = require('../middleware/auth.js');
const router = express.Router();

const sendCsv = async (res, filename, query, params = []) => {
  const { rows } = await db.query(query, params);
  const fields = Object.keys(rows[0] || {});
  const csv = fields.length ? new Parser({ fields }).parse(rows) : '';
  res.header('Content-Type', 'text/csv');
  res.attachment(filename);
  res.send(csv);
};

// GET /api/export/persons - CSV export all persons (admin)
router.get('/persons', protect, admin, async (req, res) => {
  try {
    const query = `
      SELECT p.*, u.username, w.name as woreda_name, v.name as village_name
      FROM person p
      LEFT JOIN users u ON p.user_id = u.id
      JOIN woreda w ON p.woreda_id = w.id
      JOIN village v ON p.village_id = v.id
      ORDER BY p.created_at DESC
    `;
    await sendCsv(res, 'persons.csv', query);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Export failed' });
  }
});

// GET /api/export/students - CSV export all students (admin)
router.get('/students', protect, admin, async (req, res) => {
  try {
    const query = `
      SELECT s.id, s.person_id, p.name, p.gender, p.phone, p.national_id,
             s.level, s.grade_or_year, s.field_of_study, s.institution_name,
             el.name as education_level_name,
             w.name as woreda_name, v.name as village_name,
             s.created_at
      FROM student s
      JOIN person p ON s.person_id = p.id
      LEFT JOIN education_level el ON s.education_level_id = el.id
      LEFT JOIN woreda w ON p.woreda_id = w.id
      LEFT JOIN village v ON p.village_id = v.id
      ORDER BY s.created_at DESC
    `;
    await sendCsv(res, 'students.csv', query);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Export failed' });
  }
});

// GET /api/export/workers - CSV export all workers (admin)
router.get('/workers', protect, admin, async (req, res) => {
  try {
    const query = `
      SELECT w.id, w.person_id, p.name, p.gender, p.phone, p.national_id,
             prof.name as profession_name,
             w.department, w.field_of_study,
             org.name as organization_name,
             el.name as education_level_name,
             wore.name as woreda_name, vil.name as village_name,
             w.created_at
      FROM worker w
      JOIN person p ON w.person_id = p.id
      JOIN profession prof ON w.profession_id = prof.id
      LEFT JOIN organization org ON w.organization_id = org.id
      LEFT JOIN education_level el ON w.education_level_id = el.id
      LEFT JOIN woreda wore ON p.woreda_id = wore.id
      LEFT JOIN village vil ON p.village_id = vil.id
      ORDER BY w.created_at DESC
    `;
    await sendCsv(res, 'workers.csv', query);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Export failed' });
  }
});

module.exports = router;
