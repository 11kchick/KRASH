-- Trip members table (tracks who's in each trip group)
CREATE TABLE public.trip_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trip_id, user_id)
);

ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;

-- Anyone in the trip can see members
CREATE POLICY "Trip members can view fellow members"
ON public.trip_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.trip_members tm
    WHERE tm.trip_id = trip_members.trip_id AND tm.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Trip owner can add members
CREATE POLICY "Trip owners can add members"
ON public.trip_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid()
  )
  OR user_id = auth.uid()
);

-- Trip owner or admin can remove members
CREATE POLICY "Trip owners and admins can remove members"
ON public.trip_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.trips WHERE id = trip_id AND user_id = auth.uid()
  )
  OR user_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Trip messages table
CREATE TABLE public.trip_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_messages ENABLE ROW LEVEL SECURITY;

-- Only trip members can read messages
CREATE POLICY "Trip members can read messages"
ON public.trip_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.trip_members tm
    WHERE tm.trip_id = trip_messages.trip_id AND tm.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Only trip members can send messages
CREATE POLICY "Trip members can send messages"
ON public.trip_messages FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.trip_members tm
    WHERE tm.trip_id = trip_messages.trip_id AND tm.user_id = auth.uid()
  )
);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
ON public.trip_messages FOR DELETE
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Create index for fast message retrieval
CREATE INDEX idx_trip_messages_trip_id ON public.trip_messages(trip_id, created_at);
CREATE INDEX idx_trip_members_trip_id ON public.trip_members(trip_id);
CREATE INDEX idx_trip_members_user_id ON public.trip_members(user_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_messages;

-- Auto-add trip creator as member via trigger
CREATE OR REPLACE FUNCTION public.auto_add_trip_creator()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.trip_members (trip_id, user_id)
  VALUES (NEW.id, NEW.user_id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER add_trip_creator_as_member
AFTER INSERT ON public.trips
FOR EACH ROW
EXECUTE FUNCTION public.auto_add_trip_creator();