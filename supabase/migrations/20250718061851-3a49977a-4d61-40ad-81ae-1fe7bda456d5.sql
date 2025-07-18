-- First, let's check and fix the trigger function for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
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
    COALESCE(new.raw_user_meta_data->>'user_type', 'customer'),
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

-- Ensure the trigger exists and is properly attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();