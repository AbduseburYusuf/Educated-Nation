require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.js');
const woredaRoutes = require('./routes/woredas.js');
const villageRoutes = require('./routes/villages.js');
const professionRoutes = require('./routes/professions.js');
const organizationRoutes = require('./routes/organizations.js');
const educationLevelRoutes = require('./routes/education_levels.js');
const personRoutes = require('./routes/persons.js');
const studentRoutes = require('./routes/students.js');
const workerRoutes = require('./routes/workers.js');
const unemployedRoutes = require('./routes/unemployed.js');
const reportRoutes = require('./routes/reports.js');
const exportRoutes = require('./routes/export.js');
const adminUserRoutes = require('./routes/admin/users.js');
const adminWoredaRoutes = require('./routes/admin/woredas.js');
const adminVillageRoutes = require('./routes/admin/villages.js');
const adminProfessionRoutes = require('./routes/admin/professions.js');
const adminOrganizationRoutes = require('./routes/admin/organizations.js');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

app.use(helmet());
app.use(cors({
  origin: FRONTEND_URL,
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Nation Educated People Management API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/woredas', woredaRoutes);
app.use('/api/villages', villageRoutes);
app.use('/api/professions', professionRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/education-levels', educationLevelRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/unemployed', unemployedRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/woredas', adminWoredaRoutes);
app.use('/api/admin/villages', adminVillageRoutes);
app.use('/api/admin/professions', adminProfessionRoutes);
app.use('/api/admin/organizations', adminOrganizationRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});
