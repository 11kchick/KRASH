
-- Fix conflicting profiles policies: remove the overly permissive policy I just added
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Drop the old restrictive policy and recreate as PERMISSIVE (it was incorrectly RESTRICTIVE)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING ((id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Allow trip co-members to see each other's profiles (needed for chat/trip pages)
CREATE POLICY "Trip co-members can view profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM trip_members tm1
    JOIN trip_members tm2 ON tm1.trip_id = tm2.trip_id
    WHERE tm1.user_id = auth.uid() AND tm2.user_id = profiles.id
  )
);
