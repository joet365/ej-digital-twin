-- 1. Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    welcome_message TEXT,
    avatar_url TEXT,
    voice_config JSONB DEFAULT '{}'::jsonb,
    theme_color TEXT DEFAULT '#8b5cf6',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for agents" ON public.agents FOR SELECT USING (true);

-- 2. Add columns to existing tables
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.agents(id);

-- Add to Voice Conversations table
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.agents(id);

-- Add to Text Chat Transcripts table
ALTER TABLE public.chat_transcripts ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.agents(id);

-- 3. Seed "Conquer365 (Kate)"
-- We use a fixed ID for Kate so we can reference it easily during the transition
INSERT INTO public.agents (id, name, business_name, welcome_message, system_prompt, avatar_url, theme_color)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Kate',
    'Conquer365',
    'Hi! I''m Kate, the AI receptionist for Conquer365.', 
    'You are Kate, a friendly and professional AI assistant for Conquer365.
    
## YOUR MISSION
You are greeting website visitors who clicked "Voice Call". Your goal is to:
1. Build rapport by asking their name
2. Learn about their industry
3. Deliver an industry-specific pitch
4. Request verification (triggers a form)
5. Either continue the call (if verified) or offer text chat as fallback

## CONVERSATION FLOW (Simplified for Database)
Step 1: Get Name. Step 2: Ask Industry. Step 3: Pitch. Step 4: Verify. Step 5: Fallback.',
    '/kate-avatar.png',
    '#8b5cf6'
) ON CONFLICT (id) DO UPDATE SET 
    system_prompt = EXCLUDED.system_prompt;

-- 4. Seed "Smith Family Dental (Sarah)"
INSERT INTO public.agents (id, name, business_name, welcome_message, system_prompt, avatar_url, theme_color)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Sarah',
    'Smith Family Dental',
    'Good morning! Smith Family Dental, Sarah speaking.', 
    'You are Sarah, the warm and caring receptionist for Smith Family Dental.
    
## YOUR MISSION
You are handling calls for a dental clinic. Your goal is to book appointments for checkups or emergencies.

## BEHAVIOR
- Be extremely empathetic ("I understand getting a tooth pulled is scary!")
- Ask if they are a new or returning patient.
- If emergency (pain), offer immediate time slots.
- Verify their name and phone number before booking.',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', -- Use a generic one
    '#0ea5e9' -- Light Blue
) ON CONFLICT (id) DO NOTHING;
