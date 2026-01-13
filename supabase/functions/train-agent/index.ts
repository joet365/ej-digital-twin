import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AGENT_ID = "1ef5359f-d9d0-4079-bcde-32be1631c5ba";

const CONQUER365_KNOWLEDGE = `
## About Conquer365
Conquer365 provides AI Receptionist services for businesses. We help businesses never miss a call, capture every lead, and sleep better at night.

## Key Services
1. **24/7 AI Receptionist**: Answers calls instantly, any time of day or night.
2. **Missed Call Text Back**: If a call is missed (or after the AI speaks), we instantly text the caller to engage them.
3. **Appointment Scheduling**: The AI can book appointments directly onto your calendar.
4. **Integration**: We integrate seamlessly with HighLevel (GoHighLevel) and other CRMs.
5. **Cost Effective**: Detailed pricing is available from Joe, but it's a fraction of the cost of a full-time human receptionist.

## Why Choose Us?
- Human-like voice (Kate) that sounds professional and friendly.
- Zero wait times for your customers.
- Stop losing revenue to competitors who pick up the phone.
`;

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const vapiApiKey = Deno.env.get("VAPI_API_KEY");
        if (!vapiApiKey) throw new Error("VAPI_API_KEY not found");

        console.log(`Updating agent ${AGENT_ID}...`);

        // 1. Get current agent to preserve existing config
        const getResponse = await fetch(`https://api.vapi.ai/assistant/${AGENT_ID}`, {
            headers: { "Authorization": `Bearer ${vapiApiKey}` }
        });

        if (!getResponse.ok) throw new Error("Failed to fetch agent");
        const currentAgent = await getResponse.json();

        // 2. Append knowledge to system prompt
        // Check if it's already there to avoid duplication
        let newSystemPrompt = currentAgent.model.messages[0].content;
        if (!newSystemPrompt.includes("## About Conquer365")) {
            newSystemPrompt += "\n\n" + CONQUER365_KNOWLEDGE;
        }

        // 3. Update agent
        const patchResponse = await fetch(`https://api.vapi.ai/assistant/${AGENT_ID}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${vapiApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: {
                    ...currentAgent.model,
                    messages: [
                        { role: "system", content: newSystemPrompt }
                    ]
                }
            })
        });

        if (!patchResponse.ok) {
            const err = await patchResponse.text();
            throw new Error(`Failed to update agent: ${err}`);
        }

        return new Response(JSON.stringify({ success: true, message: "Agent trained with Conquer365 knowledge" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    }
});
