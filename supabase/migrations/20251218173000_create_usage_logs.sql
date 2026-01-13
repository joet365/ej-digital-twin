-- Create Usage Logs table for centralized billing tracking
CREATE TABLE IF NOT EXISTS public.usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES public.agents(id) NOT NULL,
    
    -- Who provided the service? (e.g., 'google', 'openai', 'heygen', 'vapi')
    provider TEXT NOT NULL,
    
    -- What kind of service? (e.g., 'voice_call', 'text_generation', 'image_generation', 'video_generation')
    service_type TEXT NOT NULL,
    
    -- Specific model or endpoint (e.g., 'gemini-1.5-flash', 'avatar-video-v2')
    model_name TEXT,
    
    -- How much? (e.g., 60, 1500, 1)
    usage_quantity NUMERIC NOT NULL,
    
    -- What unit? (e.g., 'seconds', 'input_tokens', 'output_tokens', 'count')
    usage_unit TEXT NOT NULL,
    
    -- Optional: We can calculate estimated cost immediately or later
    estimated_cost_usd NUMERIC, 
    
    metadata JSONB DEFAULT '{}'::jsonb, -- Store extra IDs (call_id, message_id)
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Allow Agents (via Service Role) to insert logs. 
-- Public read access might be restricted to just the owner (future work).
CREATE POLICY "Service Insert" ON public.usage_logs FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service Select" ON public.usage_logs FOR SELECT TO service_role USING (true);
