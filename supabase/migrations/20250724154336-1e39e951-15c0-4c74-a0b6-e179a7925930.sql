
-- Create astrology_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.astrology_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_date DATE NOT NULL,
  birth_time TIME,
  birth_place TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  zodiac_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create astrology_consultations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.astrology_consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  astrologer_id UUID REFERENCES auth.users(id),
  consultation_type TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 30,
  price INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  feedback TEXT,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on astrology tables
ALTER TABLE public.astrology_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astrology_consultations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for astrology_profiles
CREATE POLICY IF NOT EXISTS "Users can manage their astrology profile" 
ON public.astrology_profiles 
FOR ALL 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Create RLS policies for astrology_consultations
CREATE POLICY IF NOT EXISTS "Users can manage their consultations" 
ON public.astrology_consultations 
FOR ALL 
USING (user_id = auth.uid() OR astrologer_id = auth.uid()) 
WITH CHECK (user_id = auth.uid() OR astrologer_id = auth.uid());

-- Add location columns to profiles table for proximity matching
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Add updated_at trigger for astrology_profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS astrology_profiles_updated_at
    BEFORE UPDATE ON public.astrology_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create function to calculate distance between two points
CREATE OR REPLACE FUNCTION public.calculate_distance(
    lat1 NUMERIC, 
    lon1 NUMERIC, 
    lat2 NUMERIC, 
    lon2 NUMERIC
) 
RETURNS NUMERIC 
LANGUAGE plpgsql
AS $$
DECLARE
    R NUMERIC := 6371; -- Earth's radius in kilometers
    dLat NUMERIC;
    dLon NUMERIC;
    a NUMERIC;
    c NUMERIC;
    d NUMERIC;
BEGIN
    -- Convert degrees to radians
    dLat := radians(lat2 - lat1);
    dLon := radians(lon2 - lon1);
    
    -- Haversine formula
    a := sin(dLat/2) * sin(dLat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dLon/2) * sin(dLon/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    d := R * c;
    
    RETURN d;
END;
$$;

-- Update bookings table to include more location data
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS customer_latitude NUMERIC,
ADD COLUMN IF NOT EXISTS customer_longitude NUMERIC,
ADD COLUMN IF NOT EXISTS booking_accepted_at TIMESTAMP WITH TIME ZONE;
