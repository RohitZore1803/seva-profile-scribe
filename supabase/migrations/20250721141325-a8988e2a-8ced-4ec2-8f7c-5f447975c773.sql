
-- Fix the user registration trigger to properly handle user_type casting
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a corrected function that properly handles the user_type enum
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

-- Clean up conflicting RLS policies to avoid duplicates
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;

-- Create streamlined RLS policies for profiles
CREATE POLICY "Users can insert their profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Add missing columns to bookings table for better workflow
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_reference TEXT,
ADD COLUMN IF NOT EXISTS invoice_number TEXT,
ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMPTZ;

-- Update RLS policies for bookings to allow pandits to update assigned bookings
DROP POLICY IF EXISTS "Pandits can update assigned bookings" ON public.bookings;

CREATE POLICY "Pandits can update assigned bookings"
  ON public.bookings
  FOR UPDATE
  USING (pandit_id = auth.uid());

-- Create a function to generate invoice numbers
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  invoice_num TEXT;
BEGIN
  SELECT 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('invoice_sequence')::TEXT, 6, '0')
  INTO invoice_num;
  
  RETURN invoice_num;
EXCEPTION
  WHEN OTHERS THEN
    -- Create sequence if it doesn't exist
    EXECUTE 'CREATE SEQUENCE IF NOT EXISTS invoice_sequence START 1';
    SELECT 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('invoice_sequence')::TEXT, 6, '0')
    INTO invoice_num;
    
    RETURN invoice_num;
END;
$$;
