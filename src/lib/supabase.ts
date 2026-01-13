import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://yuoksgysfefxplwhfprs.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b2tzZ3lzZmVmeHBsd2hmcHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2MTM5MTIsImV4cCI6MjA4MDE4OTkxMn0.Z2ujPglgT7gWxa3rCov8y1xW_oJmgjsqh3rbHYA8dF8";

export const supabase = createClient(supabaseUrl, supabaseKey);


export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    website: string;
    agent_id?: string;
    agent_config?: any;
    website_content?: string;
    scraped_at?: string;
    consent_given: boolean;
    consent_timestamp?: string;
    created_at: string;
    updated_at: string;
}

export interface Conversation {
    id: string;
    lead_id: string;
    agent_id: string;
    call_id?: string;
    duration_seconds?: number;
    started_at?: string;
    ended_at?: string;
    transcript?: any;
    summary?: string;
    created_at: string;
}

export interface TranscriptMessage {
    id: string;
    conversation_id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    created_at: string;
}
