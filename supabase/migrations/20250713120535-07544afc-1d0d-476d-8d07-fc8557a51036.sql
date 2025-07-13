
-- Create customer profiles table
CREATE TABLE public.customer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  profile_image_url TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create pandit profiles table
CREATE TABLE public.pandit_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  profile_image_url TEXT,
  address TEXT NOT NULL,
  expertise TEXT NOT NULL,
  aadhar_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER, -- price in paise (INR)
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table with fromdate and todate
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pandit_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_id INTEGER REFERENCES services(id),
  fromdate TIMESTAMPTZ NOT NULL,
  todate TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  location TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_at TIMESTAMPTZ
);

-- Create subscribers table for newsletter
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_profiles
CREATE POLICY "Users can view own customer profile"
  ON public.customer_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own customer profile"
  ON public.customer_profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own customer profile"
  ON public.customer_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for pandit_profiles
CREATE POLICY "Users can view own pandit profile"
  ON public.pandit_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own pandit profile"
  ON public.pandit_profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own pandit profile"
  ON public.pandit_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow everyone to view pandit profiles (for customer booking)
CREATE POLICY "Anyone can view pandit profiles"
  ON public.pandit_profiles
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings
  FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Pandits can view assigned bookings"
  ON public.bookings
  FOR SELECT
  USING (pandit_id = auth.uid());

CREATE POLICY "Users can create own bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON public.bookings
  FOR UPDATE
  USING (created_by = auth.uid());

-- Allow public access to services
CREATE POLICY "Anyone can view services"
  ON public.services
  FOR SELECT
  TO public
  USING (true);

-- Allow public to subscribe
CREATE POLICY "Anyone can subscribe"
  ON public.subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Insert some sample services
INSERT INTO public.services (name, description, price, image) VALUES
('Ganesh Puja', 'Traditional Ganesh worship ceremony for prosperity and removing obstacles', 250000, '/lovable-uploads/62f5c343-495a-4a65-bd20-2fc1c99fb626.png'),
('Lakshmi Puja', 'Goddess Lakshmi worship for wealth and prosperity', 300000, '/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png'),
('Saraswati Puja', 'Goddess Saraswati worship for knowledge and wisdom', 200000, '/lovable-uploads/2ee87fe5-d7a5-4aec-8867-4fb74c778dc2.png'),
('Durga Puja', 'Goddess Durga worship for protection and strength', 500000, '/lovable-uploads/1a779d2d-ca9c-4348-a5b7-1745de1e05fa.png'),
('Havan Ceremony', 'Sacred fire ritual for purification and blessings', 350000, '/lovable-uploads/779fc3ac-fc11-4830-a82c-728441c025cb.png'),
('Marriage Ceremony', 'Complete Hindu wedding ceremony with all rituals', 1500000, '/lovable-uploads/3a7d649e-67b9-4c49-9866-d9cb4f95f0aa.png');

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create policies for avatar storage
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars');
