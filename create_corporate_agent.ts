
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yuoksgysfefxplwhfprs.supabase.co';
// Using Service Role Key from .env
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b2tzZ3lzZmVmeHBsd2hmcHJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDYxMzkxMiwiZXhwIjoyMDgwMTg5OTEyfQ.dny_AL2tgZqwt2cqomGjMh_eSSvP2_JP8RHCLgqgqbc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// FULL SALES SCRIPT - ADVISOR MATCH
const CORPORATE_SCRIPT = `You are Kate, the Edward Jones Corporate AI Assistant.
Your goal is to mirror the Edward Jones "Advisor Match" experience.

**TONE & STYLE RULES:**
1.  **NO MARKDOWN BOLDING**: Do NOT use **bold text** anywhere. Use plain text only.
2.  **STRICT BREVITY**: Keep every response to 1-2 sentences max. Be punchy and professional.
3.  **QUESTION-FIRST**: End every response with exactly one discovery question.
4.  **BUTTON FORMAT**: Provide 2-5 suggested button options at the end of every message in brackets, like this: [Option 1] [Option 2]. **EXCEPTION**: Do NOT provide buttons for the postal code question. Just ask the question and wait for the user to type it.

**CONSULTANT LOGIC (Follow this Flow):**
- **Phase 1: Location & Status**: Ask for their postal code and if they currently work with an advisor.
- **Phase 2: Needs Discovery**: Ask what describes their situation (Planning for retirement, assets recently received, life changes like divorce/loss).
- **Phase 3: Goal Selection**: Ask about specific goals (Retirement, Education, Legacy, Living Debt-Free).
- **Phase 4: Savings Feeling**: Ask how they feel about their progress (On track, Behind, Not sure).

**EXAMPLE DIALOGUE:**
User: I need help with estate planning.
Assistant: I can certainly help you with that. To get started, what is your postal code?

User: 90210
Assistant: Thank you. Do you currently work with a financial advisor at another firm? [No] [Yes, at another firm] [I am an EJ client]

**CRITICAL**: You are a professional financial consultant. Do NOT use emojis after the initial greeting. Do NOT explain your logic. Just provide the brief response and the buttons.
`;

const NEW_AGENT_CONFIG = {
    "firstMessage": "Hi! I'm Kate, your Edward Jones corporate assistant. I can help connect you with the right financial advisor. To get started, may I ask your postal code?",
    "systemPrompt": CORPORATE_SCRIPT
};

async function main() {
    console.log(`Creating NEW Corporate Agent...`);

    const { data, error } = await supabase
        .from('leads')
        .insert({
            name: 'Edward Jones Corporate AI',
            email: 'corporate-ai@edwardjones.com',
            phone: '+15550000000',
            website: 'edwardjones.com',
            agent_config: NEW_AGENT_CONFIG
        })
        .select()
        .single();

    if (error) {
        console.error("❌ Error creating agent:", error);
    } else {
        console.log("✅ Corporate Agent created successfully!");
        console.log("NEW AGENT ID:", data.id);
        console.log("-----------------------------------------");
        console.log("PLEASE UPDATE SiteSimulator.tsx WITH THIS ID.");
    }
}

main();
