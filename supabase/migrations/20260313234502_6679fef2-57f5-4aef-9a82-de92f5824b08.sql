
-- 1. Remove co-member direct SELECT on profiles (email exposure)
DROP POLICY "Trip co-members can view profiles" ON public.profiles;

-- 2. Create a safe view exposing only public profile fields (no email, no marketing_opt_in)
CREATE VIEW public.profiles_safe
WITH (security_invoker = false) AS
SELECT id, name, avatar_url, bio
FROM public.profiles;

-- Grant access to authenticated users
GRANT SELECT ON public.profiles_safe TO authenticated;
GRANT SELECT ON public.profiles_safe TO anon;
