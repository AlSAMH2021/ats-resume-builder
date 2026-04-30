-- Function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- USER RESUMES
CREATE TABLE public.user_resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  lang TEXT NOT NULL DEFAULT 'ar',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resume"
ON public.user_resumes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume"
ON public.user_resumes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume"
ON public.user_resumes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume"
ON public.user_resumes FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_user_resumes_updated_at
BEFORE UPDATE ON public.user_resumes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- USER TARGETS
CREATE TABLE public.user_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  targets JSONB,
  persona TEXT,
  onboarding_done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own targets"
ON public.user_targets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own targets"
ON public.user_targets FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own targets"
ON public.user_targets FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own targets"
ON public.user_targets FOR DELETE
USING (auth.uid() = user_id);

CREATE TRIGGER update_user_targets_updated_at
BEFORE UPDATE ON public.user_targets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();