
-- First, let's check if we need to update the bookings table structure
-- Add any missing columns for better credential storage
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS special_requirements TEXT,
ADD COLUMN IF NOT EXISTS preferred_time TIME,
ADD COLUMN IF NOT EXISTS duration_hours INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS total_amount INTEGER,
ADD COLUMN IF NOT EXISTS booking_notes TEXT;

-- Update the services table to include more details
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS duration_hours INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS requirements TEXT,
ADD COLUMN IF NOT EXISTS benefits TEXT;

-- Create a table for booking items/materials if needed
CREATE TABLE IF NOT EXISTS public.booking_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  material_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  provided_by TEXT DEFAULT 'customer', -- 'customer' or 'pandit'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on booking_materials
ALTER TABLE public.booking_materials ENABLE ROW LEVEL SECURITY;

-- RLS Policy for booking_materials
CREATE POLICY "Users can view own booking materials"
  ON public.booking_materials
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_materials.booking_id 
    AND bookings.created_by = auth.uid()
  ));

CREATE POLICY "Users can insert own booking materials"
  ON public.booking_materials
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings 
    WHERE bookings.id = booking_materials.booking_id 
    AND bookings.created_by = auth.uid()
  ));
