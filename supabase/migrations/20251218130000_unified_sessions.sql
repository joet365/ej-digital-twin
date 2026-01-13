-- Migration: Add unified session tracking across voice and text channels
-- This enables Kate to have context when users switch between chat and voice calls

-- Add session_id and channel to existing conversations table (for Vapi voice calls)
ALTER TABLE public.conversations 
  ADD COLUMN IF NOT EXISTS session_id TEXT,
  ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'voice';

-- Ensure chat_transcripts has channel column (for text chat)
ALTER TABLE public.chat_transcripts
  ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'text';

-- Create indexes for fast session lookups
CREATE INDEX IF NOT EXISTS idx_conversations_session_id 
  ON public.conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_transcripts_session_id 
  ON public.chat_transcripts(session_id);

-- Create a unified view for querying all messages across channels
CREATE OR REPLACE VIEW public.unified_conversation_messages AS
SELECT 
    ct.session_id,
    ct.created_at,
    'text' as channel,
    ct.name as lead_name,
    ct.email as lead_email,
    ct.messages as message_data,
    NULL as conversation_id
FROM public.chat_transcripts ct
WHERE ct.session_id IS NOT NULL

UNION ALL

SELECT 
    c.session_id,
    c.created_at,
    'voice' as channel,
    l.name as lead_name,
    l.email as lead_email,
    NULL as message_data,
    c.id as conversation_id
FROM public.conversations c
LEFT JOIN public.leads l ON c.lead_id = l.id
WHERE c.session_id IS NOT NULL;

-- Grant access to the view
GRANT SELECT ON public.unified_conversation_messages TO authenticated;
GRANT SELECT ON public.unified_conversation_messages TO service_role;
