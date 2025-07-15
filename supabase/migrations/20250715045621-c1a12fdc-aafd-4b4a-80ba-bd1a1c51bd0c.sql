
-- Create a unified profiles table that combines customer and pandit profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  profile_image_url TEXT,
  address TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'pandit', 'admin')),
  -- Pandit specific fields
  expertise TEXT,
  aadhar_number TEXT,
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
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    email,
    user_type,
    expertise,
    address,
    aadhar_number,
    profile_image_url
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email,
    COALESCE(new.raw_user_meta_data->>'user_type', 'customer'),
    new.raw_user_meta_data->>'expertise',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'aadhar_number',
    new.raw_user_meta_data->>'profile_image_url'
  );
  RETURN new;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Migrate existing data from customer_profiles and pandit_profiles to profiles
INSERT INTO public.profiles (id, name, email, profile_image_url, address, user_type, created_at)
SELECT id, name, email, profile_image_url, address, 'customer', created_at
FROM public.customer_profiles
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, name, email, profile_image_url, address, user_type, expertise, aadhar_number, created_at)
SELECT id, name, email, profile_image_url, address, 'pandit', expertise, aadhar_number, created_at
FROM public.pandit_profiles
ON CONFLICT (id) DO NOTHING;

-- Add more sample services to display 20 services
INSERT INTO public.services (name, description, price, image, duration_hours, requirements, benefits) VALUES
('Navratri Pooja', 'Nine-day celebration of Goddess Durga with daily rituals and prayers', 45000, '/lovable-uploads/navratri.png', 2, 'Kalash, flowers, fruits, sweets', 'Brings prosperity and removes obstacles'),
('Karva Chauth Pooja', 'Traditional fast and prayer ceremony for married women', 8000, '/lovable-uploads/karva-chauth.png', 1, 'Karva, sindoor, mehendi, sweets', 'Ensures husband longevity and marital bliss'),
('Janmashtami Celebration', 'Birth celebration of Lord Krishna with devotional songs', 35000, '/lovable-uploads/janmashtami.png', 3, 'Jhula, makhan, mishri, flowers', 'Brings joy, prosperity and spiritual growth'),
('Makar Sankranti Pooja', 'Harvest festival celebration with kite flying and prayers', 15000, '/lovable-uploads/makar-sankranti.png', 2, 'Til, gud, kite, sacred thread', 'Brings abundance and prosperity'),
('Ram Navami Celebration', 'Birth celebration of Lord Rama with sacred recitations', 28000, '/lovable-uploads/ram-navami.png', 2, 'Tulsi, flowers, prasad, oil lamp', 'Brings righteousness and spiritual strength'),
('Shiv Ratri Pooja', 'Night-long prayer and fast dedicated to Lord Shiva', 32000, '/lovable-uploads/shiv-ratri.png', 6, 'Bel leaves, milk, honey, dhatura', 'Brings spiritual awakening and blessings'),
('Hanuman Jayanti', 'Birth celebration of Lord Hanuman with special prayers', 18000, '/lovable-uploads/hanuman-jayanti.png', 2, 'Sindoor, oil, besan laddu, flowers', 'Provides strength and removes obstacles'),
('Akshaya Tritiya Pooja', 'Auspicious day for new beginnings and gold purchase', 22000, '/lovable-uploads/akshaya-tritiya.png', 1, 'Gold ornament, yellow cloth, sweets', 'Brings eternal prosperity and success'),
('Teej Festival Celebration', 'Monsoon festival celebration for married women', 16000, '/lovable-uploads/teej-festival.png', 2, 'Green bangles, mehendi, sweets, flowers', 'Ensures marital happiness and longevity'),
('Karwa Chauth Vrat', 'Day-long fast and evening prayer for husband welfare', 12000, '/lovable-uploads/karwa-chauth-vrat.png', 1, 'Karwa, sieve, sindoor, sweets', 'Protects and blesses married life'),
('Tulsi Vivah Ceremony', 'Sacred marriage ceremony of Tulsi plant with Lord Vishnu', 25000, '/lovable-uploads/tulsi-vivah.png', 3, 'Tulsi plant, shaligram, wedding items', 'Brings purity and divine blessings'),
('Dev Uthani Ekadashi', 'Awakening day of Lord Vishnu from cosmic sleep', 20000, '/lovable-uploads/dev-uthani.png', 2, 'Sugarcane, banana, coconut, flowers', 'Marks auspicious time for marriages'),
('Guru Purnima Celebration', 'Full moon day dedicated to spiritual teachers', 24000, '/lovable-uploads/guru-purnima.png', 2, 'Flowers, fruits, dakshina, sacred books', 'Brings knowledge and spiritual guidance'),
('Raksha Bandhan Ceremony', 'Sacred thread tying ceremony between siblings', 8000, '/lovable-uploads/raksha-bandhan.png', 1, 'Rakhi, tilak, sweets, gifts', 'Strengthens sibling bond and protection')
ON CONFLICT (name) DO NOTHING;
