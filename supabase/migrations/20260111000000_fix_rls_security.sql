-- Migration: Fix RLS Security Issues
-- Created: 2026-01-11
-- Purpose: Address Lovable security scan findings

-- ============================================
-- FIX 1: Chat Transcripts - Restrict access to service role only
-- Issue: RLS Policies Apply to All Roles
-- ============================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Allow service role insert" ON public.chat_transcripts;
DROP POLICY IF EXISTS "Allow service role select" ON public.chat_transcripts;

-- Create proper service-role-only policies
CREATE POLICY "Service role only - insert" ON public.chat_transcripts
    FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY "Service role only - select" ON public.chat_transcripts
    FOR SELECT
    TO service_role
    USING (true);

-- Admins can view chat transcripts
CREATE POLICY "Admins can view chat transcripts" ON public.chat_transcripts
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- FIX 2: Conversations - Restrict anonymous insert
-- Issue: Client-Side Insertion Bypasses Validation
-- ============================================

DROP POLICY IF EXISTS "Service can insert conversations" ON public.conversations;

-- Only service role can insert conversations (from webhooks/edge functions)
CREATE POLICY "Service role only - insert conversations" ON public.conversations
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- ============================================
-- FIX 3: Transcript Messages - Restrict anonymous insert
-- Issue: Sensitive data insertable by anonymous users
-- ============================================

DROP POLICY IF EXISTS "Service can insert transcript messages" ON public.transcript_messages;

-- Only service role can insert transcript messages
CREATE POLICY "Service role only - insert transcript messages" ON public.transcript_messages
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- ============================================
-- FIX 4: Leads - Keep public insert but add basic validation
-- Issue: Client-Side Lead Insertion Bypasses Validation
-- Note: We keep anon insert for form submissions, but add constraints
-- ============================================

-- Add NOT NULL constraints for basic validation (if not exists)
DO $$ BEGIN
    ALTER TABLE public.leads ALTER COLUMN email SET NOT NULL;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE public.leads ALTER COLUMN name SET NOT NULL;
EXCEPTION WHEN others THEN NULL; END $$;

-- Add email format check constraint
DO $$ BEGIN
    ALTER TABLE public.leads ADD CONSTRAINT leads_email_format 
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================
-- FIX 5: Integrations - Restrict to authenticated admins
-- ============================================

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.integrations;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.integrations;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.integrations;

CREATE POLICY "Admins can view integrations" ON public.integrations
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert integrations" ON public.integrations
    FOR INSERT
    TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update integrations" ON public.integrations
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage integrations" ON public.integrations
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================
-- FIX 6: Agents - Ensure proper RLS
-- ============================================

-- Service role needs full access for edge functions
CREATE POLICY IF NOT EXISTS "Service role full access" ON public.agents
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Authenticated users can read agents (for demo page)
CREATE POLICY IF NOT EXISTS "Authenticated can read agents" ON public.agents
    FOR SELECT
    TO authenticated
    USING (true);

-- Anon can read agents (for public demo)
CREATE POLICY IF NOT EXISTS "Public can read agents" ON public.agents
    FOR SELECT
    TO anon
    USING (true);

-- ============================================
-- SUMMARY OF FIXES
-- ============================================
-- 1. chat_transcripts: Now restricted to service_role + admin
-- 2. conversations: Insert restricted to service_role
-- 3. transcript_messages: Insert restricted to service_role
-- 4. leads: Basic email validation constraint added
-- 5. integrations: Restricted to admin + service_role
-- 6. agents: Proper read access for demo page

COMMENT ON TABLE public.chat_transcripts IS 'RLS: Service role + admin only. Fixed 2026-01-11.';
COMMENT ON TABLE public.conversations IS 'RLS: Insert via service role only. Fixed 2026-01-11.';
