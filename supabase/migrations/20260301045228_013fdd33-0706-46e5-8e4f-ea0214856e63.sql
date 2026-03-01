-- Fix chat_violations SELECT policy to be permissive
DROP POLICY IF EXISTS "Users can view own violations" ON public.chat_violations;
CREATE POLICY "Users can view own violations" ON public.chat_violations
  FOR SELECT USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "System can insert violations" ON public.chat_violations;
CREATE POLICY "System can insert violations" ON public.chat_violations
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can delete violations" ON public.chat_violations;
CREATE POLICY "Admins can delete violations" ON public.chat_violations
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix chat_restrictions policies
DROP POLICY IF EXISTS "Users can view own restrictions" ON public.chat_restrictions;
CREATE POLICY "Users can view own restrictions" ON public.chat_restrictions
  FOR SELECT USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "System can insert restrictions" ON public.chat_restrictions;
CREATE POLICY "System can insert restrictions" ON public.chat_restrictions
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage restrictions" ON public.chat_restrictions;
CREATE POLICY "Admins can manage restrictions" ON public.chat_restrictions
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete restrictions" ON public.chat_restrictions;
CREATE POLICY "Admins can delete restrictions" ON public.chat_restrictions
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix trips policies
DROP POLICY IF EXISTS "Anyone can view trips" ON public.trips;
CREATE POLICY "Anyone can view trips" ON public.trips
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create trips" ON public.trips;
CREATE POLICY "Authenticated users can create trips" ON public.trips
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Owners and admins can update trips" ON public.trips;
CREATE POLICY "Owners and admins can update trips" ON public.trips
  FOR UPDATE USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Owners and admins can delete trips" ON public.trips;
CREATE POLICY "Owners and admins can delete trips" ON public.trips
  FOR DELETE USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Fix trip_members policies
DROP POLICY IF EXISTS "Trip members can view fellow members" ON public.trip_members;
CREATE POLICY "Trip members can view fellow members" ON public.trip_members
  FOR SELECT USING (
    (EXISTS (SELECT 1 FROM trip_members tm WHERE tm.trip_id = trip_members.trip_id AND tm.user_id = auth.uid()))
    OR has_role(auth.uid(), 'admin'::app_role)
  );

DROP POLICY IF EXISTS "Trip owners can add members" ON public.trip_members;
CREATE POLICY "Trip owners can add members" ON public.trip_members
  FOR INSERT WITH CHECK (
    (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_members.trip_id AND trips.user_id = auth.uid()))
    OR (user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Trip owners and admins can remove members" ON public.trip_members;
CREATE POLICY "Trip owners and admins can remove members" ON public.trip_members
  FOR DELETE USING (
    (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_members.trip_id AND trips.user_id = auth.uid()))
    OR (user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Fix admin_audit_logs policies
DROP POLICY IF EXISTS "Only admins can view audit logs" ON public.admin_audit_logs;
CREATE POLICY "Only admins can view audit logs" ON public.admin_audit_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "Only admins can insert audit logs" ON public.admin_audit_logs
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND (admin_id = auth.uid()));

-- Fix trip_messages policies
DROP POLICY IF EXISTS "Trip members can read messages" ON public.trip_messages;
CREATE POLICY "Trip members can read messages" ON public.trip_messages
  FOR SELECT USING (
    (EXISTS (SELECT 1 FROM trip_members tm WHERE tm.trip_id = trip_messages.trip_id AND tm.user_id = auth.uid()))
    OR has_role(auth.uid(), 'admin'::app_role)
  );

DROP POLICY IF EXISTS "Trip members can send messages" ON public.trip_messages;
CREATE POLICY "Trip members can send messages" ON public.trip_messages
  FOR INSERT WITH CHECK (
    (user_id = auth.uid())
    AND (EXISTS (SELECT 1 FROM trip_members tm WHERE tm.trip_id = trip_messages.trip_id AND tm.user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "Users can delete own messages" ON public.trip_messages;
CREATE POLICY "Users can delete own messages" ON public.trip_messages
  FOR DELETE USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Fix user_roles policies
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
CREATE POLICY "Only admins can insert roles" ON public.user_roles
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
CREATE POLICY "Only admins can update roles" ON public.user_roles
  FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;
CREATE POLICY "Only admins can delete roles" ON public.user_roles
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix donations policies
DROP POLICY IF EXISTS "Users can view relevant donations" ON public.donations;
CREATE POLICY "Users can view relevant donations" ON public.donations
  FOR SELECT USING (
    (donor_id = auth.uid())
    OR (EXISTS (SELECT 1 FROM trips WHERE trips.id = donations.trip_id AND trips.user_id = auth.uid()))
    OR has_role(auth.uid(), 'admin'::app_role)
  );

DROP POLICY IF EXISTS "Authenticated users can donate" ON public.donations;
CREATE POLICY "Authenticated users can donate" ON public.donations
  FOR INSERT WITH CHECK (donor_id = auth.uid());

DROP POLICY IF EXISTS "Donors and admins can update donations" ON public.donations;
CREATE POLICY "Donors and admins can update donations" ON public.donations
  FOR UPDATE USING ((donor_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Donors and admins can delete donations" ON public.donations;
CREATE POLICY "Donors and admins can delete donations" ON public.donations
  FOR DELETE USING ((donor_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Fix feedback policies
DROP POLICY IF EXISTS "Users can view own feedback" ON public.feedback;
CREATE POLICY "Users can view own feedback" ON public.feedback
  FOR SELECT USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can submit feedback" ON public.feedback;
CREATE POLICY "Users can submit feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can delete feedback" ON public.feedback;
CREATE POLICY "Admins can delete feedback" ON public.feedback
  FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));