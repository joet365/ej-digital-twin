import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per hour per IP
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getClientIP(req: Request): string {
  // Check common headers for real IP (behind proxies/load balancers)
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  // Fallback - use a hash of user-agent + other headers as fingerprint
  const fingerprint = `${req.headers.get("user-agent") || ""}-${req.headers.get("accept-language") || ""}`;
  return fingerprint || "unknown";
}

function checkRateLimit(clientIP: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitStore.get(clientIP);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 1000) {
    for (const [ip, data] of rateLimitStore.entries()) {
      if (now > data.resetTime) {
        rateLimitStore.delete(ip);
      }
    }
  }

  if (!record || now > record.resetTime) {
    // New window - allow request and start counting
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetIn: RATE_LIMIT_WINDOW_MS };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now
    };
  }

  // Increment count and allow
  record.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.count,
    resetIn: record.resetTime - now
  };
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  company_name: string | null;
}

interface FirecrawlResponse {
  success: boolean;
  data?: {
    markdown?: string;
    metadata?: {
      title?: string;
      description?: string;
    };
  };
  error?: string;
}

async function scrapeWebsite(url: string, apiKey: string): Promise<{ content: string; title: string; description: string }> {
  console.log(`Scraping website: ${url}`);

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Firecrawl error: ${response.status} - ${errorText}`);
      throw new Error(`Firecrawl failed: ${response.status}`);
    }

    const data: FirecrawlResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Scrape failed");
    }

    console.log(`Successfully scraped ${url}, content length: ${data.data?.markdown?.length || 0}`);

    return {
      content: data.data?.markdown || "",
      title: data.data?.metadata?.title || "",
      description: data.data?.metadata?.description || "",
    };
  } catch (error) {
    console.error(`Scraping error for ${url}:`, error);
    // Return empty content on error - we'll still create the agent with limited knowledge
    return { content: "", title: "", description: "" };
  }
}

function buildSystemPrompt(lead: Lead, websiteContent: string): string {
  const companyName = lead.company_name || "the company";

  // Truncate content if too long (keep under 4000 chars for prompt)
  const truncatedContent = websiteContent.length > 4000
    ? websiteContent.substring(0, 4000) + "..."
    : websiteContent;


  return `You are Kate, a friendly AI receptionist demonstrating what you can do for ${companyName}.

## CRITICAL CONTEXT
You are a DEMO of an AI receptionist product sold by Joe Tran from Conquer365.
- ${lead.name} is the PROSPECT who signed up for this demo
- PHASE 1: Act as their receptionist first - show them what you can do
- PHASE 2: After demo, transition to sales close

## Business Info
Company: ${companyName}
Website: ${lead.website}
Prospect: ${lead.name}

## Website Content (Use ONLY this for business questions)
${truncatedContent || "No website content available."}

---

## 📞 PHASE 1: RECEPTIONIST DEMO

**Opening:**
"Hi ${lead.name}! I'm Kate, your AI receptionist for ${companyName}. I've learned about your business. How can I help you today?"

**For simulated customer calls:**
- Start with: "Thanks for calling ${companyName}! This is Kate. May I get your name?"
- Use their name throughout: "Great question, [Name]!"
- Answer questions using website content
- **MANDATORY: Ask for the reason/problem** before offering an appointment (e.g., "What seems to be the issue?" or "What service are you looking for?")
- **Only offer appointment AFTER you know the reason**
- Be helpful, professional, knowledgeable

**CRITICAL - When to END the demo:**
IMMEDIATELY after one of these happens:
1. You have booked an appointment (and confirmed details)
2. They decline an appointment
3. They say "thank you" or "goodbye"
4. You have answered 2-3 questions

You MUST say:
**"Alright, this demo is over. What did you think about it?"**

This signals the end of the receptionist demo and starts the sales conversation. DO NOT say "Is there anything else?" - say the transition phrase directly.

---

## 🎯 PHASE 2: SALES TRANSITION & CLOSE

**Transition (after saying "This demo is over. What did you think?"):**

If positive → Continue to discovery
If negative → Handle objection, then continue

**Discovery Sequence (keep responses SHORT - 2-3 sentences max):**

### Step 1: Consumer Behavior (Quick)
- "When you need a service, where do you search?"
- "Do you usually call just one business, or a few?"
- "If the first doesn't answer, what do you do?"
Affirm briefly: "Exactly." / "Makes sense." / "Right."

### Step 2: The Pivot
- "Would it be fair to say YOUR customers behave the same way?"
- "And if ${companyName} isn't picking up, they're calling your competitors?"

### Step 3: Cost Calculation (THE KEY PART)
- "Do you ever have missed calls?"
- "How many per day—rough guess?"
- "What's the average value of a customer for you?"
- **CALCULATE OUT LOUD:** "So if you're missing [X] calls a day at $[Y] each, that's $[Z] a day, about $[W] a week, $[V] a month... over $[ANNUAL] a year going to your competitors."
- "Do you sell bigger ticket items—like full system replacements?" → If yes, ask price → "So even one missed call on a $[BIG_TICKET] job could pay for this for years."

### Step 4: Confirmation & Close
- "So just to recap—you're missing about [X] calls, costing you around $[ANNUAL]/year. Did I get that right?"
- "Can you see any reason why you wouldn't want to capture that revenue?"
- "Let me get you on Joe's calendar. What does your schedule look like this week?"

---

## ⛔ GUARDRAILS

1. **NO MARKETING/BUSINESS ADVICE** - "That's outside what I help with. But I CAN make sure you never miss a lead."
2. **NO DIAGNOSING** - Stay general
3. **NO ROLE PLAYING** - "I'd rather show you how I actually work."
4. **APPOINTMENTS**: 
   - For ${companyName}'s services (demo mode) → Schedule confidently
   - For AI product → Schedule with JOE TRAN
5. **NO EMOTIONAL QUESTIONS** - Don't ask about stress, feelings, reputation, or team morale

---

## Objection Handling

**"Customers prefer humans":**
"I totally get that. But big companies like Marriott, Caesars, and major healthcare organizations are switching to AI. Why? Customers don't want to wait. They want help NOW. We created this to serve your customers better—humans aren't always available, but I am. 24/7."

**"Happy with our current receptionist":**
"Great! We're not replacing them—we're helping. What happens at lunch? After hours? When 3 calls hit at once? Companies like Marriott use this, but solutions like PolyAI start at $200k/month. We built this to be affordable for businesses like yours."

**"Need to discuss with my partner":**
"Absolutely. Let's still get you on Joe's calendar—he's very busy helping businesses. Easy to reschedule, and you can bring your partner to the call. What time works?"

**"What if it doesn't work?":**
"You can cancel anytime. No long-term commitment. If it's not a fit, no problem."

**"Too robotic/stiff":**
"AI is improving every day. But here's the real question: would you rather miss a $20,000 job entirely, or have someone answer who sounds a little different? The ROI usually speaks for itself."

**"I'm too busy":**
"That's exactly why this exists—24/7 coverage so you don't have to. Let's find 15 minutes with Joe."

**"What's the cost?":**
"Joe covers pricing based on your setup. When works for a call?"

---

## Voice AI Guidelines
- Keep responses to 2-3 sentences MAX, then pause
- Let them talk—don't monologue
- After big numbers, pause to let it sink in
- Mirror their language when summarizing
- **ALWAYS end demo explicitly:** "This demo is over. What did you think?"

Remember: Demo value FIRST, then guide them to schedule with Joe.`;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  const rateLimit = checkRateLimit(clientIP);

  if (!rateLimit.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Rate limit exceeded. Please try again later.",
        retryAfterMs: rateLimit.resetIn
      }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Retry-After": Math.ceil(rateLimit.resetIn / 1000).toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(Date.now() + rateLimit.resetIn).toISOString()
        }
      }
    );
  }

  console.log(`Request allowed for IP: ${clientIP}, remaining: ${rateLimit.remaining}`);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const vapiApiKey = Deno.env.get("VAPI_API_KEY");
    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!vapiApiKey) {
      console.error("VAPI_API_KEY is not configured");
      return new Response(JSON.stringify({ success: false, error: "VAPI_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!firecrawlApiKey) {
      console.error("FIRECRAWL_API_KEY is not configured");
      return new Response(JSON.stringify({ success: false, error: "FIRECRAWL_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { leadId, name, email, phone, website, companyName, userId } = body;

    let lead: Lead;

    if (leadId) {
      // Fetch existing lead (new flow - lead already created)
      console.log(`Fetching lead: ${leadId}`);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", leadId)
        .single();

      if (error || !data) {
        console.error("Lead fetch error:", error);
        return new Response(
          JSON.stringify({ success: false, error: "Lead not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      lead = data;
    } else {
      // Legacy flow - create new lead
      console.log(`Creating lead for: ${JSON.stringify({ name, email, website })}`);

      if (!name || !email || !phone || !website) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("leads")
        .insert({
          name,
          email,
          phone,
          website,
          company_name: companyName,
          user_id: userId || null,
          consent_given: true,
          consent_timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error || !data) {
        console.error("Lead creation error:", error);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to create lead" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      lead = data;
      console.log(`Lead created: ${lead.id}`);
    }

    // Scrape the website using Firecrawl
    console.log(`Starting website scrape for: ${lead.website}`);
    const { content: websiteContent, title, description } = await scrapeWebsite(lead.website, firecrawlApiKey);

    // Build intelligent system prompt with scraped content
    const systemPrompt = buildSystemPrompt(lead, websiteContent);
    const companyDisplayName = lead.company_name || title || "the company";

    const firstMessage = `Hi ${lead.name}! I'm Kate, your AI receptionist for ${companyDisplayName}. I've learned about your business from your website. How can I help you today?`;

    // Create Vapi assistant with scraped knowledge
    console.log("Creating Vapi assistant with scraped content...");

    const vapiPayload = {
      name: `Kate - ${companyDisplayName} Assistant`,
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt }
        ],
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en",
      },
      firstMessage,
      endCallMessage: "Thanks for calling! Have a great day!",
      serverUrl: `${supabaseUrl}/functions/v1/vapi-webhook`,
    };

    const vapiResponse = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${vapiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vapiPayload),
    });

    if (!vapiResponse.ok) {
      const errorText = await vapiResponse.text();
      console.error("Vapi error:", vapiResponse.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create Vapi assistant" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const vapiData = await vapiResponse.json();
    const agentId = vapiData.id;
    console.log(`Vapi assistant created: ${agentId}`);

    // Update lead with agent data and website content
    const agentConfig = {
      vapiAssistantId: agentId,
      systemPrompt,
      websiteTitle: title,
      websiteDescription: description,
      scrapedContentLength: websiteContent.length,
      createdAt: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from("leads")
      .update({
        agent_id: agentId,
        agent_config: agentConfig,
        website_content: websiteContent.substring(0, 10000), // Store first 10k chars
        scraped_at: new Date().toISOString(),
      })
      .eq("id", lead.id);

    if (updateError) {
      console.error("Lead update error:", updateError);
    }

    console.log(`Agent created successfully: ${JSON.stringify({ agentId, leadId: lead.id, contentLength: websiteContent.length })}`);

    return new Response(
      JSON.stringify({
        success: true,
        agentId,
        leadId: lead.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": rateLimit.remaining.toString()
        }
      }
    );
  } catch (error: any) {
    console.error("Generate agent error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
