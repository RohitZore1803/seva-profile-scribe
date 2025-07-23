
-- Fix the handle_new_user trigger to not process password data
-- Supabase Auth handles passwords separately and securely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a corrected function that only handles profile data (not passwords)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only insert if profile doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = new.id) THEN
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
      -- Properly cast the user_type to the enum
      CASE 
        WHEN new.raw_user_meta_data->>'user_type' = 'pandit' THEN 'pandit'::public.user_type
        ELSE 'customer'::public.user_type
      END,
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
