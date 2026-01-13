
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_SYSTEM_PROMPT = `
You are a helpful AI Assistant.
Your tone is professional, friendly, and helpful. Keep responses concise for chat.
`;

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { messages, sessionId, agentId } = await req.json();

        if (!messages) {
            throw new Error("Missing messages in request body");
        }

        if (!GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY secret is not set");
        }

        // 1. Fetch Dynamic Agent Prompt if agentId is provided
        let systemPrompt = DEFAULT_SYSTEM_PROMPT;

        if (agentId && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
            const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
            const { data: lead, error } = await supabase
                .from('leads')
                .select('agent_config')
                .eq('id', agentId)
                .single();

            if (!error && lead?.agent_config?.systemPrompt) {
                console.log(`Using custom system prompt for agent: ${agentId}`);
                systemPrompt = lead.agent_config.systemPrompt;
            } else if (error) {
                console.error(`Error fetching agent config for ${agentId}:`, error.message);
            }
        }

        // Transform messages to Gemini Format:
        const contents = messages.map((m: any) => ({
            role: m.role === "assistant" || m.role === "model" ? "model" : "user",
            parts: [{ text: m.content || m.text }]
        }));

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const payload = {
            system_instruction: {
                parts: [{ text: systemPrompt }]
            },
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500, // Increased for longer scripts/buttons
            }
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error details:", data.error);
            throw new Error(data.error.message || "Gemini API Error");
        }

        // Extract reply
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return new Response(JSON.stringify({ reply }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in chat-completion:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
