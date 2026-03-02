
-- Create a security definer function to check co-membership without triggering RLS
CREATE OR REPLACE FUNCTION public.is_trip_co_member(_viewer_id uuid, _profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM trip_members tm1
    JOIN trip_members tm2 ON tm1.trip_id = tm2.trip_id
    WHERE tm1.user_id = _viewer_id AND tm2.user_id = _profile_id
  )
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Trip co-members can view profiles" ON public.profiles;

-- Recreate it using the security definer function
CREATE POLICY "Trip co-members can view profiles"
ON public.profiles
FOR SELECT
USING (public.is_trip_co_member(auth.uid(), id));

-- Also fix trip_members SELECT policy to avoid self-reference
DROP POLICY IF EXISTS "Trip members can view fellow members" ON public.trip_members;

CREATE OR REPLACE FUNCTION public.is_trip_member(_user_id uuid, _trip_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM trip_members
    WHERE user_id = _user_id AND trip_id = _trip_id
  )
$$;

CREATE POLICY "Trip members can view fellow members"
ON public.trip_members
FOR SELECT
USING (public.is_trip_member(auth.uid(), trip_id) OR public.has_role(auth.uid(), 'admin'));
