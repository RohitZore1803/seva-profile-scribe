-- Create admin user for testing
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@eguruji.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- Create admin profile
INSERT INTO public.profiles (id, name, email, user_type, is_verified)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Admin User',
  'admin@eguruji.com',
  'admin',
  true
)
ON CONFLICT (id) DO NOTHING;