-- Fix profiles: make SELECT policy permissive
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING ((id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Fix profiles: make INSERT policy permissive
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Fix profiles: make UPDATE policy permissive
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Fix profiles: make DELETE policy permissive
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE USING ((id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));