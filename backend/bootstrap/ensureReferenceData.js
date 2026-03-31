const db = require('../db.js');

const REQUIRED_LOCATIONS = {
  Afar: ['Ifat'],
  Harari: ['Omerdin', 'Koromi', 'Hulo', 'Afardeba'],
  Oromia: ['Esakoy', 'Adasha', 'Ikiyo'],
};

const findMatchingVillageId = async (woredaId, villageName) => {
  if (villageName === 'Esakoy') {
    const { rows } = await db.query(
      `SELECT id
       FROM village
       WHERE woreda_id = $1
         AND lower(name) IN ('esakoy', 'esaqoy')
       LIMIT 1`,
      [woredaId]
    );
    return rows[0]?.id || null;
  }

  const { rows } = await db.query(
    `SELECT id
     FROM village
     WHERE woreda_id = $1
       AND lower(name) = lower($2)
     LIMIT 1`,
    [woredaId, villageName]
  );
  return rows[0]?.id || null;
};

const ensureReferenceData = async () => {
  for (const [woredaName, villages] of Object.entries(REQUIRED_LOCATIONS)) {
    await db.query(
      `INSERT INTO woreda (name)
       VALUES ($1)
       ON CONFLICT (name) DO NOTHING`,
      [woredaName]
    );

    const woredaResult = await db.query(
      'SELECT id FROM woreda WHERE name = $1 LIMIT 1',
      [woredaName]
    );
    const woredaId = woredaResult.rows[0]?.id;

    if (!woredaId) {
      continue;
    }

    for (const villageName of villages) {
      const existingVillageId = await findMatchingVillageId(woredaId, villageName);
      if (existingVillageId) {
        if (villageName === 'Esakoy') {
          await db.query(
            'UPDATE village SET name = $1 WHERE id = $2',
            [villageName, existingVillageId]
          );
        }
        continue;
      }

      await db.query(
        `INSERT INTO village (name, woreda_id)
         VALUES ($1, $2)`,
        [villageName, woredaId]
      );
    }
  }
};

module.exports = ensureReferenceData;
