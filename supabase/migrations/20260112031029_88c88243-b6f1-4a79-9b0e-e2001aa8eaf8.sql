-- Fix RLS Disabled Security Issues
-- Enable RLS on tables that have it disabled

-- 1. Enable RLS on chat_transcripts (contains PII: email, phone, name)
ALTER TABLE public.chat_transcripts ENABLE ROW LEVEL SECURITY;

-- 2. Enable RLS on generated_assets
ALTER TABLE public.generated_assets ENABLE ROW LEVEL SECURITY;

-- 3. Add RLS policy for generated_assets (public read, service role write)
CREATE POLICY "Public read access for generated_assets"
ON public.generated_assets
FOR SELECT
USING (true);

CREATE POLICY "Service role insert for generated_assets"
ON public.generated_assets
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role update for generated_assets"
ON public.generated_assets
FOR UPDATE
USING (true);

CREATE POLICY "Service role delete for generated_assets"
ON public.generated_assets
FOR DELETE
USING (true);