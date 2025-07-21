
-- Clean up existing conflicting functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_profile ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_profile();

-- Create a single, comprehensive function to handle new user profiles
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
      COALESCE((new.raw_user_meta_data->>'user_type')::public.user_type, 'customer'),
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

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Clean up RLS policies to avoid conflicts
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create clean, non-conflicting RLS policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Insert pooja data into services table
INSERT INTO public.services (name, description, price, image, duration_hours, benefits, requirements)
VALUES 
  ('Vaastu Shanti', 'Vaastu Shanti Puja is a spiritual and religious process to offer prayers to the Vastu Purush, the Lord, protector, and soul of the house, to seek blessings for positivity and prosperity. It also pays tribute to the deity of directions, five elements of nature, and natural forces.', 100000, '/lovable-uploads/dc4a5c8a-3832-4bfc-860c-e235b8c225b7.png', 2, 'This puja helps in negating Vastu dosha and inviting harmony into your dwelling space. Traditionally performed before occupying a new home, or after major renovations.', 'Clean space, flowers, incense, offerings'),
  ('Griha Pravesh', 'Griha Pravesh Puja is performed before entering a new house for the first time. It purifies the space and invokes blessings of happiness, health, and prosperity for the occupants.', 120000, '/lovable-uploads/2263f060-33f7-4944-b853-5a140ec68e36.png', 2, 'Best performed on auspicious dates (muhurats), this ritual ensures peace and spiritual safety for new residents. It wards off negative energies and brings positive vibrations.', 'New house, puja materials, flowers'),
  ('Bhoomi Pooja', 'Bhoomi Pooja is performed before the construction of a new building to seek blessings from the earth, remove negative energies, and promote successful project completion.', 110000, '/lovable-uploads/2ee87fe5-d7a5-4aec-8867-4fb74c778dc2.png', 1, 'It is believed to remove obstacles caused by the disturbance of land and pacifies spiritual energies. This puja expresses gratitude and harmony with Mother Earth.', 'Land site, coconut, flowers, turmeric'),
  ('Satya Narayan', 'Satya Narayan Puja is performed to seek the blessings of Lord Vishnu for overall prosperity and happiness. It is observed on auspicious occasions and after achieving significant milestones.', 90000, '/lovable-uploads/c1a5b2a3-ee18-40e5-8581-c3c52d85a9b9.png', 2, 'This puja brings good luck, success, and spiritual advancement. Frequently performed during housewarmings, birthdays, and marriages across India.', 'Banana leaves, sweets, fruits, sacred thread'),
  ('Durja Pooja', 'Durja Puja is dedicated to invoking the blessings of the Goddess Durga to gain strength, courage, and protection from negative energies.', 100000, '/lovable-uploads/b9a8b749-7987-4c52-ba97-a3805e555da7.png', 2, 'Ideal during Navratri and related festivals, the puja helps overcome fears and obstacles, signifying the victory of good over evil.', 'Red flowers, vermillion, coconut, sweets'),
  ('Office Opening Pooja', 'Office Opening Pooja ensures the workspace is abundant with positive energy, success, and prosperity for all stakeholders.', 200000, '/lovable-uploads/65e174e3-c7e8-4606-a7a6-2b458a910f4c.png', 1, 'Recommended for new business ventures; removes hurdles, brings growth, and invokes blessings for financial health and teamwork.', 'Office space, Ganesha idol, marigold flowers'),
  ('Mahalakshmi Pooja', 'Mahalakshmi Pooja is performed to invite Goddess Lakshmi, the harbinger of wealth and prosperity, into homes and businesses.', 140000, '/lovable-uploads/d8c3c874-61f6-4372-b601-3ebe4c4580c0.png', 2, 'Commonly performed during Diwali, Fridays, and Akshay Tritiya; believed to bestow financial abundance and remove scarcity.', 'Lotus flowers, gold items, rice, coins'),
  ('Ganpati Pooja', 'Ganpati Puja is dedicated to Lord Ganesha, the remover of obstacles, and is performed before starting any new venture.', 120000, '/lovable-uploads/62f5c343-495a-4a65-bd20-2fc1c99fb626.png', 2, 'Ganpati is worshipped at the start of important tasks. Ensures work begins without hindrance and brings intelligence and wisdom.', 'Ganesha idol, modak, red flowers, durva grass'),
  ('Rudra Abhishek', 'Rudra Abhishek is a ritual for Lord Shiva to gain health, wealth, and to dissolve negative karmas, performed especially during the month of Shravan.', 180000, '/lovable-uploads/695814da-ae02-443d-8ab9-80dfa76c9755.png', 3, 'A sacred bath ritual with holy substances, believed to fulfill wishes and cleanse souls. Enhances well-being when performed on Mondays.', 'Shiva lingam, milk, honey, bel leaves'),
  ('Mangalagaur Pooja', 'Mangalagaur Puja is a Maharashtrian tradition observed by married women for the wellbeing and prosperity of their families.', 130000, '/lovable-uploads/5d3e5a15-cb00-4549-9a4d-3efc26b032cd.png', 2, 'Celebrated during Shravan, it involves games, singing, and devotion, praying for marital bliss and family welfare.', 'Turmeric, vermillion, bangles, sweets'),
  ('Ganpati Visarjan Pooja', 'Ganpati Visarjan Puja is performed at the conclusion of Ganesh Chaturthi, bidding farewell to Lord Ganesha and seeking prosperity till next time.', 90000, '/lovable-uploads/8f56705a-3508-48d2-b025-b9746aa30f85.png', 1, 'This ritual symbolizes letting go of obstacles and starting anew. Families immerse Ganesha idols with songs and processions.', 'Ganesha idol, flowers, drums, procession items'),
  ('Janmashtami Pooja', 'Janmashtami Puja celebrates the birth of Lord Krishna and invokes his blessings for happiness and peace in the household.', 110000, '/lovable-uploads/6953ad6b-9da3-45bc-bc02-63febada4a34.png', 2, 'Devotees observe a night-long vigil, fasting, and sing devotional songs. Dahi Handi is a special part in Maharashtra.', 'Krishna idol, butter, milk, peacock feathers'),
  ('Diwali Lakshmi Pooja', 'Lakshmi Puja during Diwali brings good fortune, prosperity and removes negative energies from home and business.', 210000, '/lovable-uploads/7a18e668-8e8d-4d40-a8a8-a286e4089324.png', 2, 'The most auspicious Diwali event, this puja welcomes Goddess Lakshmi into homes with lights, rangoli, and sweets.', 'Diyas, rangoli, lotus, gold coins, sweets'),
  ('Ganapti Sthapana Pooja', 'Ganesh Sthapana Puja marks the arrival of Lord Ganesha before Ganeshotsav begins, seeking his blessings for a successful festival.', 100000, '/lovable-uploads/3a7d649e-67b9-4c49-9866-d9cb4f95f0aa.png', 1, 'Brings positivity to the household. Sthapana is performed on Chaturthi and invokes a festive spirit for 10 days.', 'New Ganesha idol, throne, decorations'),
  ('Udak Shanti', 'Udak Shanti Puja is performed to purify water and bring harmony and prosperity to the household.', 95000, '/lovable-uploads/251e248a-4351-49bd-8651-6aeefdaee648.png', 1, 'Ideal for housewarming and before major functions, this ritual promotes purity, health, and blessings from divine forces.', 'Sacred water, kalash, mango leaves'),
  ('Navgraha Shanti', 'Navgraha Shanti Puja helps neutralize negative influences of all nine planets and brings peace and prosperity.', 170000, '/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png', 3, 'Highly recommended for astrological imbalances. Often suggested after tough times or planetary transitions (dasha/antardasha).', 'Nine planet idols, specific grains, colored flowers'),
  ('Ganapti Havan', 'Ganpati Havan purifies the mind and environment while seeking Lord Ganesh''s blessings before major work or events.', 150000, '/lovable-uploads/07f5ed97-9548-4467-b6f8-68cf9301ec72.png', 2, 'The sacred fire ritual removes hurdles and brings auspicious beginnings. Ghee, sesame, and herbs are key elements.', 'Havan kund, ghee, sesame, sacred wood'),
  ('Dhan Laxmi Pooja', 'Dhan Lakshmi Puja is performed to invoke Goddess Lakshmi for wealth, abundance, and success in business.', 200000, '/lovable-uploads/b9ec4e6a-73d1-4536-8eaa-809140586224.png', 2, 'Particularly relevant for business owners and before Diwali. Believed to open new sources of financial income.', 'Lakshmi idol, gold items, rice, lotus'),
  ('Ganesh Havan', 'Ganesh Havan is performed for new beginnings, removing obstacles, and ensuring success in all endeavors.', 160000, '/lovable-uploads/9ec09147-1249-4be2-9391-19df10c3d32f.png', 2, 'Recommended before weddings, new businesses, or exams. It is said to bring clarity and a fresh start.', 'Havan materials, Ganesha offerings, ghee'),
  ('Satyanarayan Havan', 'Satyanarayan Havan is performed to ensure achievements, peace, and prosperity in life. It also helps fulfill your wishes and brings spiritual bliss.', 120000, '/lovable-uploads/1a779d2d-ca9c-4348-a5b7-1745de1e05fa.png', 2, 'A great choice for celebrating milestones and family occasions, believed to maintain harmony and protect against misfortune.', 'Havan kund, Vishnu offerings, sacred fire materials')
ON CONFLICT (name) DO NOTHING;
