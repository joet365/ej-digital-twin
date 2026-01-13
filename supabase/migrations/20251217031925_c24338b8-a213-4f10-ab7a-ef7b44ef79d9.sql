-- Add error tracking columns to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS last_error TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS last_error_at TIMESTAMP WITHOUT TIME ZONE;