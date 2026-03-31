# Nation Educated People Management System ✅

Updated full-stack app matching specs: React frontend, Express backend, PostgreSQL DB, JWT auth.

## Features Implemented

- JWT auth with register, login, and current-user session restore
- Personal profile creation and editing
- Student, worker, and unemployed graduate flows
- Admin management pages for persons, students, workers, villages, professions, organizations, and reports
- Public health endpoint and protected API routes

## Project Structure

- `frontend/` React + Vite client
- `backend/` Express API
- `database/` schema and seed files
- `docs/` notes and plans
- `scripts/` helper scripts

## Setup

### 1. Database Setup

```bash
psql -h localhost -U postgres -d nation_db -f database/schema.sql
psql -h localhost -U postgres -d nation_db -f database/seed.sql
```

### 2. Backend

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your DB_PASSWORD, JWT_SECRET
cd backend
npm install
npm run dev  # http://localhost:5000
```

### 3. Frontend

```bash
./scripts/start-frontend.sh  # http://localhost:5173
```

## Demo Credentials

- `admin` / `password123`
- `testuser` / `password123`

## Improvements

- Full edu edit prefill
- Server search and pagination improvements
- See `TODO.md` and `docs/TODO2.md` for remaining tasks.

Fully functional!
