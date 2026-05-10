DROP POLICY IF EXISTS "Authenticated users can view trips" ON public.trips;
CREATE POLICY "Anyone can view trips"
ON public.trips
FOR SELECT
USING (true);