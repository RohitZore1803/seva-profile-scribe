
-- Drop the unnecessary separate profile tables since we have a unified profiles table
DROP TABLE IF EXISTS public.customer_profiles CASCADE;
DROP TABLE IF EXISTS public.pandit_profiles CASCADE;

-- Ensure the profiles table has all necessary fields with proper defaults
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Update the trigger function to handle profile creation properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    COALESCE(new.raw_user_meta_data->>'user_type', 'customer'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'expertise',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'aadhar_number',
    new.raw_user_meta_data->>'profile_image_url',
    false
  );
  RETURN new;
END;
$$;
