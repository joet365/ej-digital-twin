import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
    text: string;
    isKate: boolean;
    timestamp: string;
}

interface TranscriptData {
    name: string;
    email: string;
    phone?: string;
    industry?: string;
    interest?: string;
    tcpaConsent?: boolean;
    messages: Message[];
    sessionId?: string;
    userAgent?: string;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const data: TranscriptData = await req.json();

        // Validate required fields
        if (!data.name || !data.email || !data.messages) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: name, email, messages" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Calculate duration (from first to last message)
        let durationSeconds = 0;
        if (data.messages.length >= 2) {
            const firstTime = new Date(data.messages[0].timestamp).getTime();
            const lastTime = new Date(data.messages[data.messages.length - 1].timestamp).getTime();
            durationSeconds = Math.round((lastTime - firstTime) / 1000);
        }

        // Initialize Supabase client with service role
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Insert transcript
        const { data: insertedData, error } = await supabase
            .from("chat_transcripts")
            .insert({
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                industry: data.industry || null,
                interest: data.interest || null,
                tcpa_consent: data.tcpaConsent || false,
                messages: data.messages,
                message_count: data.messages.length,
                session_id: data.sessionId || null,
                user_agent: data.userAgent || null,
                duration_seconds: durationSeconds,
                completed_lead_capture: true,
                source: "web_chat",
            })
            .select("id")
            .single();

        if (error) {
            console.error("Failed to save transcript:", error);
            return new Response(
                JSON.stringify({ error: "Failed to save transcript", details: error.message }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log("Transcript saved:", insertedData?.id);

        return new Response(
            JSON.stringify({ success: true, transcriptId: insertedData?.id }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (err) {
        console.error("Error in save-transcript:", err);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
