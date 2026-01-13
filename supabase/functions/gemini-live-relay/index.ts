import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const upgrade = req.headers.get("upgrade") || "";
    if (upgrade.toLowerCase() != "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
        console.error("GEMINI_API_KEY not set");
        return new Response("Server configuration error", { status: 500 });
    }

    // 1. Get Agent ID from URL
    const urlObj = new URL(req.url);
    const agentId = urlObj.searchParams.get("agentId") || "00000000-0000-0000-0000-000000000001";

    // 2. Fetch Agent Config
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let systemInstructionText = "You are a helpful AI assistant.";
    let voiceName = "Kore";
    let welcomeMessage = "Hi! How can I help you today?";

    try {
        const { data: agent, error } = await supabase
            .from('agents')
            .select('*')
            .eq('id', agentId)
            .single();

        if (agent) {
            systemInstructionText = agent.system_prompt;
            welcomeMessage = agent.welcome_message || welcomeMessage;

            // Manual Verification Override (Enforce clicking button)
            if (agentId === '00000000-0000-0000-0000-000000000001') {
                systemInstructionText = `CRITICAL: You are Kate. Speak in a VERY HAPPY, EXTREMELY ENERGETIC, and WARM voice at all times! Start the conversation with high energy.\n\n` + systemInstructionText;

                systemInstructionText += `\n\nCONVERSATION FLOW (FOLLOW STRICTLY):
1. GREETING: "Hi, my name is Kate with Conquer365, It's great to meet you! May I ask whom am I speaking to?"
2. GET INDUSTRY: "It's nice to meet you, [Name]! Can you tell me what industry are you in?"
3. CHECK AI USAGE: "Do you use AI in your business right now?"
4. DIG DEEPER: "How do you think AI can help you?"
5. TRIGGER VERIFICATION: "Before we continue with more conversation, I need to get your information. Please click the teal 'My Contact Info' button below."

VERIFICATION INSTRUCTIONS:
1. When user verifies details (via system message), READ THEM BACK.
2. IF user confirms: Say "Great!" AND IMMEDIATELY TRANSITION TO STEP 6.
3. IF user says info is WRONG: Handle verbal correction.

STEP 6: SALES TRANSITION (Post-Verification)
Once verified, say: "Thanks for verifying! Now, let me ask you: When you need a service, where do you search? Do you ever go past Google's first page?"

STEP 7: PAIN & COST DISCOVERY (Follow this strict logic):
- Ask: "Do you usually call just one business, or a few?"
- Ask: "If the first doesn't answer, what do you do?" (Wait for "Call next one").
- Pivot: "Would it be fair to say YOUR customers behave the same way?"
- CALCULATION: "Do you ever have missed calls? How many per day? What's an average customer worth?"
- MATH: verbally calculate the loss (Calls x Value = Loss). Say: "That's $[Amount] going to competitors."

STEP 8: THE CLOSE
- Ask: "Can you see any reason why you wouldn't want something that closes that gap?"
- Closing Question: "Let me get you on Joe's calendar. What does your schedule look like?"

OBJECTION HANDLING:
- "Customers prefer humans": -> "I get that. But Marriott and Caesars use AI. Customers don't want to wait. I'm here 24/7."
- "Happy with current receptionist": -> "Great! I help them. What happens at lunch? Or 2am? PolyAI costs $200k. We are affordable."
- "What if it doesn't work?": -> "Cancel anytime. No commitment."
- "Too robotic": -> "Would you rather miss a $20k job or have someone answer? The ROI speaks for itself."

GUARDRAILS:
- NO Pricing (Say "Joe covers pricing").
- NO Marketing Advice.
- Goal: BOOK APPOINTMENT with JOE.`;

                welcomeMessage = "Hi, my name is Kate with Conquer365, It's great to meet you! May I ask whom am I speaking to?";
            }

            // logic for voice name from voice_config if exists
            // voiceName = agent.voice_config?.voiceName || "Kore"; 
        } else {
            console.error("Agent not found:", error);
        }
    } catch (e) {
        console.error("Error fetching agent:", e);
    }

    // 3. Prepare Setup Payload
    const setupPayload = {
        setup: {
            model: "models/gemini-2.0-flash-exp",
            // Tools removed to revert to manual verification flow
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: voiceName,
                        },
                    },
                },
            },
            systemInstruction: {
                parts: [{ text: systemInstructionText }],
            },
        },
    };

    // 4. Upgrade and Connect
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);

    const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${geminiApiKey}`;

    setupGeminiRelay(clientSocket, geminiUrl, setupPayload, welcomeMessage, supabase, agentId);

    return response;
});

async function setupGeminiRelay(
    clientSocket: WebSocket,
    geminiUrl: string,
    setupPayload: any,
    welcomeMessage: string,
    supabase: any,
    agentId: string
) {
    const geminiSocket = new WebSocket(geminiUrl);
    const messageQueue: string[] = [];
    let isGeminiOpen = false;
    let startTime: number | null = null;
    let hasLogged = false;

    const logUsage = async () => {
        if (hasLogged || !startTime) return;
        hasLogged = true;
        const durationSeconds = (Date.now() - startTime) / 1000;

        console.log(`Logging usage: ${durationSeconds} seconds for agent ${agentId}`);

        try {
            await supabase.from('usage_logs').insert({
                agent_id: agentId,
                provider: 'google',
                service_type: 'voice_call',
                model_name: 'gemini-2.0-flash-exp',
                usage_quantity: durationSeconds,
                usage_unit: 'seconds'
            });
        } catch (err) {
            console.error("Failed to log usage:", err);
        }
    };

    clientSocket.onopen = () => {
        console.log("Client connected");
    };

    clientSocket.onmessage = (event) => {
        if (isGeminiOpen) {
            geminiSocket.send(event.data);
        } else {
            messageQueue.push(event.data as string);
        }
    };

    clientSocket.onclose = () => {
        console.log("Client disconnected");
        logUsage(); // Log usage when client disconnects
        if (geminiSocket.readyState === WebSocket.OPEN) {
            geminiSocket.close();
        }
    };

    geminiSocket.onopen = () => {
        console.log("Gemini connected");
        isGeminiOpen = true;

        // 1. Send Setup Message
        console.log("Sending setup payload:", JSON.stringify(setupPayload));
        geminiSocket.send(JSON.stringify(setupPayload));

        // 2. Trigger Initial Greeting (with slight delay to ensure Setup processed)
        setTimeout(() => {
            console.log("Triggering initial greeting:", welcomeMessage);
            const initialMsg = {
                clientContent: {
                    turns: [
                        {
                            role: "user",
                            parts: [{ text: `Please say this exact phrase to start the conversation: "${welcomeMessage}"` }]
                        }
                    ],
                    turnComplete: true
                }
            };
            if (geminiSocket.readyState === WebSocket.OPEN) {
                geminiSocket.send(JSON.stringify(initialMsg));
            }
        }, 500);

        // 2. Send any buffered messages
        while (messageQueue.length > 0) {
            const msg = messageQueue.shift();
            if (msg) geminiSocket.send(msg);
        }
    };

    geminiSocket.onmessage = (event) => {
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(event.data);
        }
    };

    geminiSocket.onclose = (event) => {
        console.log("Gemini disconnected code:", event.code, "reason:", event.reason);
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({ error: `Gemini closed: ${event.code} ${event.reason}` }));
            clientSocket.close();
        }
    };

    geminiSocket.onerror = (error) => {
        console.error("Gemini WebSocket error:", error);
        if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({ error: "Gemini connection error" }));
        }
    };
}
