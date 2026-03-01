
-- Fix 1: Trips should require authentication to view (prevents travel plan scraping)
DROP POLICY IF EXISTS "Anyone can view trips" ON public.trips;
CREATE POLICY "Authenticated users can view trips"
ON public.trips
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Fix 2: Add a PERMISSIVE base policy for profiles SELECT so the RESTRICTIVE policy works correctly
-- Currently only RESTRICTIVE policies exist, which means NO rows are returned.
-- We need a PERMISSIVE base that grants access to authenticated users, then RESTRICTIVE narrows it.
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);
