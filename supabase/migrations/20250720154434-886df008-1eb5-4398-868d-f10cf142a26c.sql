
-- Clear existing data and drop current structure
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
TRUNCATE TABLE public.profiles CASCADE;

-- Create admin_profiles table for admin users
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Admin',
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_profiles
CREATE POLICY "Admins can view their own profile"
  ON public.admin_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can insert their own profile"
  ON public.admin_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update their own profile"
  ON public.admin_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Update the handle_new_user function to properly handle user types
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_type_value text;
BEGIN
  -- Get user_type from metadata, default to 'customer'
  user_type_value := COALESCE(new.raw_user_meta_data->>'user_type', 'customer');
  
  -- Only insert into profiles table for regular users (not admins)
  IF user_type_value IN ('customer', 'pandit') THEN
    INSERT INTO public.profiles (
      id,
      name,
      email,
      user_type,
      phone,
      expertise,
      address,
      aadhar_number,
      profile_image_url,
      is_verified
    )
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
      new.email,
      user_type_value::public.user_type,
      new.raw_user_meta_data->>'phone',
      new.raw_user_meta_data->>'expertise',
      new.raw_user_meta_data->>'address',
      new.raw_user_meta_data->>'aadhar_number',
      new.raw_user_meta_data->>'profile_image_url',
      COALESCE((new.raw_user_meta_data->>'is_verified')::boolean, false)
    );
  END IF;
  
  RETURN new;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
