const express = require('express');
const db = require('../db.js');
const { protect } = require('../middleware/auth.js');
const router = express.Router();

// Dashboard stats (protected)
router.get('/stats', protect, async (req, res) => {
  try {
    const [
      totalUsers,
      totalPersons,
      totalStudents,
      totalWorkers,
      totalUnemployed,
      diplomaHolders,
      degreeHolders,
      mastersHolders,
      totalWoredas,
      totalVillages
    ] = await Promise.all([
      db.query('SELECT COUNT(*)::int as count FROM users'),
      db.query('SELECT COUNT(*)::int as count FROM person'),
      db.query("SELECT COUNT(*)::int as count FROM person WHERE type = 'student'"),
      db.query("SELECT COUNT(*)::int as count FROM person WHERE type = 'worker'"),
      db.query("SELECT COUNT(*)::int as count FROM person WHERE type = 'unemployed_graduate'"),
      db.query(`
        SELECT COUNT(*)::int as count FROM person p
        JOIN worker w ON p.id = w.person_id WHERE w.education_level_id = (SELECT id FROM education_level WHERE name = 'diploma')
        UNION ALL
        SELECT COUNT(*)::int FROM person p JOIN student s ON p.id = s.person_id WHERE s.education_level_id = (SELECT id FROM education_level WHERE name = 'diploma')
        UNION ALL
        SELECT COUNT(*)::int FROM person p JOIN unemployed u ON p.id = u.person_id WHERE u.education_level_id = (SELECT id FROM education_level WHERE name = 'diploma')
      `),
      db.query(`
        SELECT COUNT(*)::int FROM person p JOIN worker w ON p.id = w.person_id WHERE w.education_level_id = (SELECT id FROM education_level WHERE name = 'degree')
        UNION ALL
        SELECT COUNT(*)::int FROM person p JOIN student s ON p.id = s.person_id WHERE s.education_level_id = (SELECT id FROM education_level WHERE name = 'degree')
        UNION ALL
        SELECT COUNT(*)::int FROM person p JOIN unemployed u ON p.id = u.person_id WHERE u.education_level_id = (SELECT id FROM education_level WHERE name = 'degree')
      `),
      db.query(`
        SELECT COUNT(*)::int FROM person p JOIN worker w ON p.id = w.person_id WHERE w.education_level_id = (SELECT id FROM education_level WHERE name = 'masters')
        UNION ALL
        SELECT COUNT(*)::int FROM person p JOIN student s ON p.id = s.person_id WHERE s.education_level_id = (SELECT id FROM education_level WHERE name = 'masters')
        UNION ALL
        SELECT COUNT(*)::int FROM person p JOIN unemployed u ON p.id = u.person_id WHERE u.education_level_id = (SELECT id FROM education_level WHERE name = 'masters')
      `),
      db.query('SELECT COUNT(*)::int as count FROM woreda'),
      db.query('SELECT COUNT(*)::int as count FROM village')
    ]);

    const stats = {
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalPersons: parseInt(totalPersons.rows[0].count),
      students: parseInt(totalStudents.rows[0].count),
      workers: parseInt(totalWorkers.rows[0].count),
      unemployed: parseInt(totalUnemployed.rows[0].count),
      diplomaHolders: diplomaHolders.rows.reduce((sum, r) => sum + parseInt(r.count), 0),
      degreeHolders: degreeHolders.rows.reduce((sum, r) => sum + parseInt(r.count), 0),
      mastersHolders: mastersHolders.rows.reduce((sum, r) => sum + parseInt(r.count), 0),
      totalWoredas: parseInt(totalWoredas.rows[0].count),
      totalVillages: parseInt(totalVillages.rows[0].count)
    };

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stats failed' });
  }
});

// Diploma holders per woreda (workers + college/univ students diploma)
router.get('/diploma-per-woreda', async (req, res) => {
  try {
    const query = `
      SELECT w.name as woreda_name, COUNT(*) as count
      FROM person p
      JOIN woreda w ON p.woreda_id = w.id
      JOIN worker wr ON p.id = wr.person_id AND wr.education_level_id = (SELECT id FROM education_level WHERE name = 'diploma')
      GROUP BY w.id, w.name
      UNION
      SELECT w.name, COUNT(*)
      FROM person p JOIN woreda w ON p.woreda_id = w.id
      JOIN student s ON p.id = s.person_id AND s.education_level_id = (SELECT id FROM education_level WHERE name = 'diploma')
      GROUP BY w.id, w.name
      ORDER BY count DESC
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Report failed' });
  }
});

// Degree per woreda (similar, degree)
router.get('/degree-per-woreda', async (req, res) => {
  try {
    const query = `
      SELECT w.name, COUNT(*) as count FROM person p JOIN woreda w ON p.woreda_id = w.id
      JOIN worker wr ON p.id = wr.person_id AND wr.education_level_id = (SELECT id FROM education_level WHERE name = 'degree')
      GROUP BY w.id, w.name
      UNION
      SELECT w.name, COUNT(*) FROM person p JOIN woreda w ON p.woreda_id = w.id
      JOIN student s ON p.id = s.person_id AND s.education_level_id = (SELECT id FROM education_level WHERE name = 'degree')
      GROUP BY w.id, w.name
      ORDER BY count DESC
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Report failed' });
  }
});

// Professionals by profession
router.get('/profession', async (req, res) => {
  try {
    const query = `
      SELECT prof.name, COUNT(*) as count
      FROM worker w JOIN profession prof ON w.profession_id = prof.id
      GROUP BY prof.id, prof.name
      ORDER BY count DESC
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Report failed' });
  }
});

// Students by level (grade9-12, college, university)
router.get('/students/:level', async (req, res) => {
  try {
    const { level } = req.params;
    const query = `
      SELECT COUNT(*) as count FROM student s JOIN person p ON s.person_id = p.id 
      WHERE s.level = $1 AND p.type = 'student'
    `;
    const { rows } = await db.query(query, [level]);
    res.json({ level, count: parseInt(rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: 'Report failed' });
  }
});

// Educated per woreda (total students + workers)
router.get('/educated-per-woreda', async (req, res) => {
  try {
    const query = `
      SELECT w.name, COUNT(DISTINCT p.id)::int as total
      FROM person p JOIN woreda w ON p.woreda_id = w.id
      WHERE p.type IN ('student', 'worker')
      GROUP BY w.id, w.name
      ORDER BY total DESC
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Report failed' });
  }
});

// Educated per village
router.get('/educated-per-village', async (req, res) => {
  try {
    const query = `
      SELECT v.name, w.name as woreda_name, COUNT(DISTINCT p.id)::int as total
      FROM person p JOIN village v ON p.village_id = v.id JOIN woreda w ON v.woreda_id = w.id
      WHERE p.type IN ('student', 'worker')
      GROUP BY v.id, w.id, v.name, w.name
      ORDER BY total DESC
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Report failed' });
  }
});

module.exports = router;

