-- Create chat_transcripts table for storing full conversation history
CREATE TABLE IF NOT EXISTS public.chat_transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Lead info
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    industry TEXT,
    interest TEXT,
    tcpa_consent BOOLEAN DEFAULT FALSE,
    
    -- Conversation data
    messages JSONB NOT NULL, -- Array of {text, isKate, timestamp}
    message_count INTEGER,
    
    -- Metadata
    source TEXT DEFAULT 'web_chat',
    session_id TEXT,
    user_agent TEXT,
    
    -- Analytics
    duration_seconds INTEGER, -- Time from first to last message
    completed_lead_capture BOOLEAN DEFAULT FALSE
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chat_transcripts_email ON public.chat_transcripts(email);
CREATE INDEX IF NOT EXISTS idx_chat_transcripts_created_at ON public.chat_transcripts(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.chat_transcripts ENABLE ROW LEVEL SECURITY;

-- Allow insert from Edge Functions (service role)
CREATE POLICY "Allow service role insert" ON public.chat_transcripts
    FOR INSERT
    WITH CHECK (true);

-- Allow service role to read all
CREATE POLICY "Allow service role select" ON public.chat_transcripts
    FOR SELECT
    USING (true);
