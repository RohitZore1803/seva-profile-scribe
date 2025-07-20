
-- Drop the existing profiles table and related triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create a clean profiles table with proper user_type enum
CREATE TYPE public.user_type AS ENUM ('pandit', 'customer');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  profile_image_url TEXT,
  address TEXT,
  user_type public.user_type NOT NULL DEFAULT 'customer',
  -- Pandit specific fields
  expertise TEXT,
  aadhar_number TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
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
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email,
    COALESCE((new.raw_user_meta_data->>'user_type')::public.user_type, 'customer'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'expertise',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'aadhar_number',
    new.raw_user_meta_data->>'profile_image_url',
    COALESCE((new.raw_user_meta_data->>'is_verified')::boolean, false)
  );
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create admin user profile manually (since admin won't go through normal signup)
-- This will be created when admin first logs in through the admin auth system
