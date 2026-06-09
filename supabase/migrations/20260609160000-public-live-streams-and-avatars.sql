-- Keep live stream viewing public while protecting stream publishing.
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view available live streams" ON public.live_streams;
CREATE POLICY "Public can view available live streams"
ON public.live_streams
FOR SELECT
TO anon, authenticated
USING (status IN ('live', 'scheduled'));

DROP POLICY IF EXISTS "Authenticated users can create own live streams" ON public.live_streams;
CREATE POLICY "Authenticated users can create own live streams"
ON public.live_streams
FOR INSERT
TO authenticated
WITH CHECK (pandit_id = auth.uid());

DROP POLICY IF EXISTS "Stream owners can update own live streams" ON public.live_streams;
CREATE POLICY "Stream owners can update own live streams"
ON public.live_streams
FOR UPDATE
TO authenticated
USING (pandit_id = auth.uid())
WITH CHECK (pandit_id = auth.uid());

DROP POLICY IF EXISTS "Stream owners can delete own live streams" ON public.live_streams;
CREATE POLICY "Stream owners can delete own live streams"
ON public.live_streams
FOR DELETE
TO authenticated
USING (pandit_id = auth.uid());

-- Make profile photo uploads reliable for both customer and pandit dashboards.
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can read avatars" ON storage.objects;
CREATE POLICY "Public can read avatars"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can delete avatars" ON storage.objects;
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');
