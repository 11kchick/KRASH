
-- Track chat violations per user
CREATE TABLE public.chat_violations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  blocked_content TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own violations"
  ON public.chat_violations FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert violations"
  ON public.chat_violations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can delete violations"
  ON public.chat_violations FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Track chat restrictions
CREATE TABLE public.chat_restrictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reason TEXT NOT NULL DEFAULT 'Repeated content violations',
  is_permanent BOOLEAN NOT NULL DEFAULT false,
  restricted_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_restrictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own restrictions"
  ON public.chat_restrictions FOR SELECT
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert restrictions"
  ON public.chat_restrictions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage restrictions"
  ON public.chat_restrictions FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete restrictions"
  ON public.chat_restrictions FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_chat_violations_user ON public.chat_violations(user_id);
CREATE INDEX idx_chat_restrictions_user ON public.chat_restrictions(user_id);
