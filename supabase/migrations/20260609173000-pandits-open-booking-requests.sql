-- Allow verified pandits to see and accept open customer booking requests.
-- Customer-created bookings start as status='pending' with pandit_id=NULL.
-- Without these policies, RLS hides them from every pandit dashboard.

DROP POLICY IF EXISTS pandits_view_open_booking_requests ON public.bookings;
CREATE POLICY pandits_view_open_booking_requests
ON public.bookings
FOR SELECT
USING (
  public.get_user_role(auth.uid()) = 'pandit'
  AND status = 'pending'
  AND pandit_id IS NULL
);

DROP POLICY IF EXISTS pandits_accept_open_booking_requests ON public.bookings;
CREATE POLICY pandits_accept_open_booking_requests
ON public.bookings
FOR UPDATE
USING (
  public.get_user_role(auth.uid()) = 'pandit'
  AND status = 'pending'
  AND pandit_id IS NULL
)
WITH CHECK (
  public.get_user_role(auth.uid()) = 'pandit'
  AND (
    (pandit_id = auth.uid() AND status IN ('assigned', 'confirmed'))
    OR (pandit_id IS NULL AND status = 'cancelled')
  )
);

DROP POLICY IF EXISTS pandits_view_booking_customer_profiles ON public.profiles;
CREATE POLICY pandits_view_booking_customer_profiles
ON public.profiles
FOR SELECT
USING (
  public.get_user_role(auth.uid()) = 'pandit'
  AND EXISTS (
    SELECT 1
    FROM public.bookings
    WHERE bookings.created_by = profiles.id
      AND (
        (bookings.status = 'pending' AND bookings.pandit_id IS NULL)
        OR bookings.pandit_id = auth.uid()
      )
  )
);
