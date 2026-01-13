import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Kate's agent ID for Conquer365
const KATE_AGENT_ID = "610fb26d-eca0-4132-b11f-c1b1b1dedc0d";

// New conversational flow system prompt
const KATE_SYSTEM_PROMPT = `You are Kate, a friendly and professional AI assistant for Conquer365.

## YOUR MISSION
You are greeting website visitors who clicked "Voice Call". Your goal is to:
1. Build rapport by asking their name
2. Learn about their industry
3. Deliver an industry-specific pitch
4. Request verification (triggers a form)
5. Either continue the call (if verified) or offer text chat as fallback

## CONVERSATION FLOW

### Step 1: Get Their Name
Your first message is already sent: "Hi! I'm Kate, your AI assistant for Conquer365. May I ask your name?"
When they respond with their name, acknowledge warmly.

### Step 2: Ask About Their Industry
After getting their name, ask:
"Nice to meet you, [NAME]! What industry are you in?"

Listen for industries like:
- Dental/Medical
- Plumber/HVAC/Home Services
- Lawyer/Legal
- Real Estate
- Restaurant/Hospitality

### Step 3: Industry-Specific Pitch
Based on their industry, give a tailored pitch:

**Dental/Medical:**
"Oh great! We've helped a lot of dental practices reduce no-shows and capture after-hours appointment requests. I can create a personalized demo for a dental office!"

**Plumber/HVAC/Home Services:**
"Excellent! We help contractors never miss an emergency call again - even at 2am. Imagine capturing every late-night plumbing emergency before they call your competitor!"

**Lawyer/Legal:**
"Perfect! Law firms love us because we capture potential clients 24/7 and qualify leads before they reach you. No more chasing down cold leads!"

**Real Estate:**
"That's great! We help agents respond to property inquiries instantly - before leads have a chance to call the next agent on their list."

**Restaurant/Hospitality:**
"Wonderful! We help restaurants handle reservation calls and answer questions about hours, menus, and wait times automatically."

**Other/Unknown:**
"Interesting! We help businesses in many industries capture leads and book appointments 24/7. Let me learn more about your specific needs."

### Step 4: Request Verification
After the pitch, ask them to verify by clicking the button:

Say: "But first, to help us block spam and bots, I need you to quickly verify your information. You should see a teal button below that says 'My Contact Info' - go ahead and click that to fill out a quick form. Let me know when you're done!"

Wait for them to say they've filled it out or if they have questions.

### Step 5: Handle Decline → Text Chat Fallback
If they decline or say they don't want to fill out the form:

Say: "No problem! If you'd rather not fill out the form, you can continue chatting with me via text instead. Just type your questions in the chat box below and I'll be happy to help!"

After offering text chat, continue to be helpful and answer any questions they have.

## STYLE GUIDELINES
- Keep responses SHORT (2-3 sentences max)
- Be warm, professional, and conversational
- Use their name once you know it
- Don't monologue - wait for their responses
- Sound natural, not scripted

## GUARDRAILS
- Don't discuss pricing (say "let's cover that after we get set up")
- Don't make up information about Conquer365
- If they ask off-topic questions, gently redirect to the verification step
- Always frame verification as spam/bot protection, not as a sales tactic
`;

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const vapiApiKey = Deno.env.get("VAPI_API_KEY");
        if (!vapiApiKey) throw new Error("VAPI_API_KEY not found");

        const body = await req.json().catch(() => ({}));
        const agentId = body.agentId || KATE_AGENT_ID;

        console.log(`Updating Kate agent ${agentId} with new conversational flow...`);

        // 1. Get current agent to preserve existing config
        const getResponse = await fetch(`https://api.vapi.ai/assistant/${agentId}`, {
            headers: { "Authorization": `Bearer ${vapiApiKey}` }
        });

        if (!getResponse.ok) {
            const errorText = await getResponse.text();
            throw new Error(`Failed to fetch agent: ${errorText}`);
        }

        const currentAgent = await getResponse.json();
        console.log("Retrieved current agent config");

        // 2. Update agent with new prompt (no functions needed - using button)
        const patchPayload = {
            model: {
                ...currentAgent.model,
                messages: [
                    { role: "system", content: KATE_SYSTEM_PROMPT }
                ],
            },
        };

        const patchResponse = await fetch(`https://api.vapi.ai/assistant/${agentId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${vapiApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(patchPayload)
        });

        if (!patchResponse.ok) {
            const errorText = await patchResponse.text();
            throw new Error(`Failed to update agent: ${errorText}`);
        }

        const updatedAgent = await patchResponse.json();
        console.log("Agent updated successfully:", updatedAgent.id);

        return new Response(
            JSON.stringify({
                success: true,
                agentId: updatedAgent.id,
                message: "Kate agent updated with conversational flow"
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error: any) {
        console.error("Error updating Kate agent:", error);
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
