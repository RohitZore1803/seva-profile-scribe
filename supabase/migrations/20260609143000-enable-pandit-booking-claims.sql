-- Let pandits see new unassigned booking requests and claim one safely.
-- Customers still see their own bookings through existing owner policies.

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT user_type::text FROM public.profiles WHERE id = user_id;
$$;

DROP POLICY IF EXISTS "Pandits can view pending bookings" ON public.bookings;
DROP POLICY IF EXISTS "Pandits can claim pending bookings" ON public.bookings;

CREATE POLICY "Pandits can view pending bookings"
  ON public.bookings
  FOR SELECT
  USING (
    status = 'pending'
    AND pandit_id IS NULL
    AND public.get_user_role(auth.uid()) = 'pandit'
  );

CREATE POLICY "Pandits can claim pending bookings"
  ON public.bookings
  FOR UPDATE
  USING (
    status = 'pending'
    AND pandit_id IS NULL
    AND public.get_user_role(auth.uid()) = 'pandit'
  )
  WITH CHECK (
    status IN ('assigned', 'confirmed')
    AND pandit_id = auth.uid()
    AND public.get_user_role(auth.uid()) = 'pandit'
  );
