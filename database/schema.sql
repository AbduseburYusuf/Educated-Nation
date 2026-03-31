-- Full PostgreSQL Schema for Nation Educated People Management System (Updated)
-- Run: psql -h localhost -U postgres -d nation_db -f schema.sql

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (auth)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  CONSTRAINT chk_role CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Woreda table
CREATE TABLE IF NOT EXISTS woreda (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Village table (FK to woreda)
CREATE TABLE IF NOT EXISTS village (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  woreda_id INTEGER REFERENCES woreda(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education Level lookup
CREATE TABLE IF NOT EXISTS education_level (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN ('diploma', 'degree', 'masters')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profession lookup
CREATE TABLE IF NOT EXISTS profession (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organization lookup
CREATE TABLE IF NOT EXISTS organization (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Person table (core, with uniqueness per user)
CREATE TABLE IF NOT EXISTS person (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(200) NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  birth_date DATE,
  phone VARCHAR(20) UNIQUE,
  national_id VARCHAR(50) UNIQUE,
  woreda_id INTEGER NOT NULL REFERENCES woreda(id) ON DELETE RESTRICT,
  village_id INTEGER NOT NULL REFERENCES village(id) ON DELETE RESTRICT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('student', 'worker', 'unemployed_graduate')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE person
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'person_status_check'
  ) THEN
    ALTER TABLE person
    ADD CONSTRAINT person_status_check
    CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Student table
CREATE TABLE IF NOT EXISTS student (
  id SERIAL PRIMARY KEY,
  person_id INTEGER UNIQUE NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  level VARCHAR(50) NOT NULL CHECK (level IN ('Grade 9-12', 'College', 'University')),
  grade_or_year VARCHAR(20),
  field_of_study VARCHAR(200),
  education_level_id INTEGER REFERENCES education_level(id),
  institution_name VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Worker table
CREATE TABLE IF NOT EXISTS worker (
  id SERIAL PRIMARY KEY,
  person_id INTEGER UNIQUE NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  profession_id INTEGER NOT NULL REFERENCES profession(id),
  department VARCHAR(200),
  organization_id INTEGER REFERENCES organization(id),
  education_level_id INTEGER NOT NULL REFERENCES education_level(id),
  field_of_study VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unemployed Graduate table
CREATE TABLE IF NOT EXISTS unemployed (
  id SERIAL PRIMARY KEY,
  person_id INTEGER UNIQUE NOT NULL REFERENCES person(id) ON DELETE CASCADE,
  field_of_study VARCHAR(200) NOT NULL,
  education_level_id INTEGER NOT NULL REFERENCES education_level(id),
  graduation_year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance/reports
CREATE INDEX IF NOT EXISTS idx_person_user ON person(user_id);
CREATE INDEX IF NOT EXISTS idx_person_woreda ON person(woreda_id);
CREATE INDEX IF NOT EXISTS idx_person_village ON person(village_id);
CREATE INDEX IF NOT EXISTS idx_person_type ON person(type);
CREATE INDEX IF NOT EXISTS idx_student_level ON student(level);
CREATE INDEX IF NOT EXISTS idx_worker_profession ON worker(profession_id);

-- Insert lookup data
INSERT INTO education_level (name) VALUES ('diploma'), ('degree'), ('masters') ON CONFLICT DO NOTHING;

INSERT INTO woreda (name) VALUES 
('Addis Ababa'), ('Oromia'), ('Amhara'), ('Tigray'), ('SNNPR'), ('Afar'), ('Somali'), ('Harari') 
ON CONFLICT DO NOTHING;

INSERT INTO village (name, woreda_id)
SELECT 'Ifat', id
FROM woreda
WHERE name = 'Afar'
  AND NOT EXISTS (
    SELECT 1 FROM village
    WHERE woreda_id = woreda.id
      AND lower(name) = lower('Ifat')
  );

INSERT INTO village (name, woreda_id)
SELECT village_name, woreda_id
FROM (
  VALUES
    ('Omerdin', (SELECT id FROM woreda WHERE name = 'Harari')),
    ('Koromi', (SELECT id FROM woreda WHERE name = 'Harari')),
    ('Hulo', (SELECT id FROM woreda WHERE name = 'Harari')),
    ('Afardeba', (SELECT id FROM woreda WHERE name = 'Harari')),
    ('Esakoy', (SELECT id FROM woreda WHERE name = 'Oromia')),
    ('Adasha', (SELECT id FROM woreda WHERE name = 'Oromia')),
    ('Ikiyo', (SELECT id FROM woreda WHERE name = 'Oromia'))
) AS required_villages(village_name, woreda_id)
WHERE woreda_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM village existing
    WHERE existing.woreda_id = required_villages.woreda_id
      AND (
        lower(existing.name) = lower(required_villages.village_name)
        OR (
          lower(required_villages.village_name) = 'esakoy'
          AND lower(existing.name) = 'esaqoy'
        )
      )
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_person_updated_at ON person;
CREATE TRIGGER update_person_updated_at BEFORE UPDATE ON person FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify
-- \dt
-- \d person
-- \d users
