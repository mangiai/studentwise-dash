-- StudentWise test auth users
-- Password for ALL users: StudentWise123!
--
-- Run after seed.sql in Supabase SQL Editor or:
--   npx supabase db query --linked --file supabase/seed-auth-users.sql
--
-- Prefer on cloud: npm run seed:users (Admin API — most reliable)
--
-- Requires: pgcrypto (enabled by default on Supabase)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fixed UUIDs so student/teacher links stay stable across re-runs
-- admin@studentwise.test
-- sarah@studentwise.test  -> 2026-BSCS-0042
-- hassan@studentwise.test -> 2026-BSCS-0043
-- teacher@studentwise.test -> FAC-2018-014
-- maryam@studentwise.test -> 2025-BSEE-0118

-- Remove stale identities (older seeds used UUID as provider_id; GoTrue expects email)
DELETE FROM auth.identities
WHERE user_id IN (
  'a0000001-0001-4001-8001-000000000001',
  'a0000002-0002-4002-8002-000000000002',
  'a0000003-0003-4003-8003-000000000003',
  'a0000004-0004-4004-8004-000000000004',
  'a0000005-0005-4005-8005-000000000005'
);

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000001-0001-4001-8001-000000000001',
    'authenticated',
    'authenticated',
    'admin@studentwise.test',
    crypt('StudentWise123!', gen_salt('bf', 10)),
    now(),
    '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
    '{"full_name":"Portal Admin"}'::jsonb,
    now(),
    now(),
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000002-0002-4002-8002-000000000002',
    'authenticated',
    'authenticated',
    'sarah@studentwise.test',
    crypt('StudentWise123!', gen_salt('bf', 10)),
    now(),
    '{"provider":"email","providers":["email"],"role":"student"}'::jsonb,
    '{"full_name":"Sarah Ahmed"}'::jsonb,
    now(),
    now(),
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000003-0003-4003-8003-000000000003',
    'authenticated',
    'authenticated',
    'hassan@studentwise.test',
    crypt('StudentWise123!', gen_salt('bf', 10)),
    now(),
    '{"provider":"email","providers":["email"],"role":"student"}'::jsonb,
    '{"full_name":"Hassan Raza"}'::jsonb,
    now(),
    now(),
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000004-0004-4004-8004-000000000004',
    'authenticated',
    'authenticated',
    'teacher@studentwise.test',
    crypt('StudentWise123!', gen_salt('bf', 10)),
    now(),
    '{"provider":"email","providers":["email"],"role":"teacher"}'::jsonb,
    '{"full_name":"Dr. Aamir Khan"}'::jsonb,
    now(),
    now(),
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000005-0005-4005-8005-000000000005',
    'authenticated',
    'authenticated',
    'maryam@studentwise.test',
    crypt('StudentWise123!', gen_salt('bf', 10)),
    now(),
    '{"provider":"email","providers":["email"],"role":"student"}'::jsonb,
    '{"full_name":"Maryam Khan"}'::jsonb,
    now(),
    now(),
    '', '', '', ''
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  updated_at = now();

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES
  (
    'b0000001-0001-4001-8001-000000000001',
    'a0000001-0001-4001-8001-000000000001',
    'admin@studentwise.test',
    '{"sub":"a0000001-0001-4001-8001-000000000001","email":"admin@studentwise.test","email_verified":true}'::jsonb,
    'email',
    now(), now(), now()
  ),
  (
    'b0000002-0002-4002-8002-000000000002',
    'a0000002-0002-4002-8002-000000000002',
    'sarah@studentwise.test',
    '{"sub":"a0000002-0002-4002-8002-000000000002","email":"sarah@studentwise.test","email_verified":true}'::jsonb,
    'email',
    now(), now(), now()
  ),
  (
    'b0000003-0003-4003-8003-000000000003',
    'a0000003-0003-4003-8003-000000000003',
    'hassan@studentwise.test',
    '{"sub":"a0000003-0003-4003-8003-000000000003","email":"hassan@studentwise.test","email_verified":true}'::jsonb,
    'email',
    now(), now(), now()
  ),
  (
    'b0000004-0004-4004-8004-000000000004',
    'a0000004-0004-4004-8004-000000000004',
    'teacher@studentwise.test',
    '{"sub":"a0000004-0004-4004-8004-000000000004","email":"teacher@studentwise.test","email_verified":true}'::jsonb,
    'email',
    now(), now(), now()
  ),
  (
    'b0000005-0005-4005-8005-000000000005',
    'a0000005-0005-4005-8005-000000000005',
    'maryam@studentwise.test',
    '{"sub":"a0000005-0005-4005-8005-000000000005","email":"maryam@studentwise.test","email_verified":true}'::jsonb,
    'email',
    now(), now(), now()
  )
ON CONFLICT (provider_id, provider) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  identity_data = EXCLUDED.identity_data,
  updated_at = now();

INSERT INTO public.profiles (id, full_name, role)
VALUES
  ('a0000001-0001-4001-8001-000000000001', 'Portal Admin', 'admin'),
  ('a0000002-0002-4002-8002-000000000002', 'Sarah Ahmed', 'student'),
  ('a0000003-0003-4003-8003-000000000003', 'Hassan Raza', 'student'),
  ('a0000004-0004-4004-8004-000000000004', 'Dr. Aamir Khan', 'teacher'),
  ('a0000005-0005-4005-8005-000000000005', 'Maryam Khan', 'student')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = now();

UPDATE public.students SET user_id = 'a0000002-0002-4002-8002-000000000002', name = 'Sarah Ahmed' WHERE id = '2026-BSCS-0042';
UPDATE public.students SET user_id = 'a0000003-0003-4003-8003-000000000003', name = 'Hassan Raza' WHERE id = '2026-BSCS-0043';
UPDATE public.students SET user_id = 'a0000005-0005-4005-8005-000000000005', name = 'Maryam Khan' WHERE id = '2025-BSEE-0118';
UPDATE public.teachers SET user_id = 'a0000004-0004-4004-8004-000000000004', name = 'Dr. Aamir Khan' WHERE id = 'FAC-2018-014';
