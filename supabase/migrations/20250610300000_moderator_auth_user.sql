-- Moderator demo auth user (safe to re-run on deploy)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0000006-0006-4006-8006-000000000006',
  'authenticated',
  'authenticated',
  'moderator@studentwise.test',
  crypt('StudentWise123!', gen_salt('bf', 10)),
  now(),
  '{"provider":"email","providers":["email"],"role":"moderator"}'::jsonb,
  '{"full_name":"Portal Moderator"}'::jsonb,
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
VALUES (
  'b0000006-0006-4006-8006-000000000006',
  'a0000006-0006-4006-8006-000000000006',
  'moderator@studentwise.test',
  '{"sub":"a0000006-0006-4006-8006-000000000006","email":"moderator@studentwise.test","email_verified":true}'::jsonb,
  'email',
  now(), now(), now()
)
ON CONFLICT (provider_id, provider) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  identity_data = EXCLUDED.identity_data,
  updated_at = now();

INSERT INTO public.profiles (id, full_name, role)
VALUES ('a0000006-0006-4006-8006-000000000006', 'Portal Moderator', 'moderator')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  updated_at = now();
