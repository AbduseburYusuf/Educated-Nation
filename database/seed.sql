-- Enhanced Seed data for testing unemployed, new fields
-- Run: psql -h localhost -U postgres -d nation_db -f seed.sql

-- Users
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@nation.et', '$2a$12$DP4e2knO7weAjVU.Ao50oOMeyCH096.X37wP/yk7NsqR8..GE93N.', 'admin'),
('testuser', 'test@nation.et', '$2a$12$TLxzEGZRj7Hfkdf0KuFZzests.BpGkTP/OitdvQSGT1fmfB2zq/Ei', 'user')
ON CONFLICT (username) DO NOTHING;
-- Passwords: 'password123' for both admin and testuser

-- More woredas/villages
INSERT INTO woreda (name) VALUES 
('Gullele'), ('Lideta'), ('Nifas Silk'), ('Akaky Kaliti') ON CONFLICT DO NOTHING;

INSERT INTO village (name, woreda_id) VALUES 
('Kebele 01', (SELECT id FROM woreda WHERE name='Bole')),
('Kebele 02', (SELECT id FROM woreda WHERE name='Yeka')),
('Village C', (SELECT id FROM woreda WHERE name='Gullele'))
ON CONFLICT DO NOTHING;

-- Required regions and villages for Afar, Harari, Oromia
INSERT INTO woreda (name) VALUES 
('Afar'), ('Harari'), ('Oromia') 
ON CONFLICT (name) DO NOTHING;

INSERT INTO village (name, woreda_id)
SELECT 'Ifat', id
FROM woreda
WHERE name = 'Afar'
  AND NOT EXISTS (
    SELECT 1 FROM village
    WHERE name = 'Ifat' AND woreda_id = woreda.id
  );

INSERT INTO village (name, woreda_id)
SELECT village_name, woreda_id
FROM (
  VALUES
    ('Omerdin', (SELECT id FROM woreda WHERE name = 'Harari')),
    ('Koromi', (SELECT id FROM woreda WHERE name = 'Harari')),
    ('Afardeba', (SELECT id FROM woreda WHERE name = 'Harari')),
    ('Hulo', (SELECT id FROM woreda WHERE name = 'Harari')),
    ('Adasha', (SELECT id FROM woreda WHERE name = 'Oromia')),
    ('Esaqoy', (SELECT id FROM woreda WHERE name = 'Oromia')),
    ('Ikiyo', (SELECT id FROM woreda WHERE name = 'Oromia'))
) AS required_villages(village_name, woreda_id)
WHERE woreda_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM village existing
    WHERE existing.woreda_id = required_villages.woreda_id
      AND lower(existing.name) = lower(required_villages.village_name)
  );

-- Lookup data for forms
INSERT INTO profession (name) VALUES 
('Nurse'), ('Software Engineer'), ('Doctor'), ('Teacher'), ('Engineer') ON CONFLICT DO NOTHING;

INSERT INTO organization (name) VALUES 
('Ministry of Education'), ('Addis Ababa University'), ('Commercial Bank of Ethiopia') ON CONFLICT DO NOTHING;

-- Sample persons with user_id, gender, birth_date, unemployed
INSERT INTO person (user_id, name, gender, birth_date, phone, national_id, woreda_id, village_id, type) VALUES 
(2, 'Test Student', 'male', '2000-05-15', '0912345678', 'NAT001', 1, 1, 'student'),
(2, 'Test Worker', 'female', '1995-03-20', '0918765432', 'NAT002', 2, 2, 'worker'),
(1, 'Test Unemployed', 'other', '1998-11-10', '0911122334', 'NAT003', 3, 3, 'unemployed_graduate')
ON CONFLICT (national_id) DO NOTHING;

-- Sample student
INSERT INTO student (person_id, level, grade_or_year, field_of_study, education_level_id, institution_name) VALUES 
((SELECT id FROM person WHERE national_id='NAT001'), 'University', 'Year 3', 'Computer Science', 2, 'AAU')
ON CONFLICT DO NOTHING;

-- Sample worker
INSERT INTO worker (person_id, profession_id, department, education_level_id, organization_id, field_of_study) VALUES 
((SELECT id FROM person WHERE national_id='NAT002'), 1, 'IT', 2, 1, 'Software Engineering')
ON CONFLICT (person_id) DO NOTHING;

-- Sample unemployed
INSERT INTO unemployed (person_id, field_of_study, education_level_id, graduation_year) VALUES 
((SELECT id FROM person WHERE national_id='NAT003'), 'Medicine', 2, 2023)
ON CONFLICT DO NOTHING;

-- Verify
SELECT 'Users' as table_name, count(*) FROM users
UNION ALL SELECT 'Persons', count(*) FROM person;
