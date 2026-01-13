import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Verify HMAC-SHA256 signature from Vapi
async function verifyVapiSignature(payload: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature || !secret) {
    return false
  }

  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    const expectedSignature = Array.from(new Uint8Array(signatureBytes))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Constant-time comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) {
      return false
    }

    let result = 0
    for (let i = 0; i < signature.length; i++) {
      result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i)
    }
    return result === 0
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method)
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Read the raw body for signature verification
    const rawBody = await req.text()

    // Verify Vapi webhook signature - FAIL CLOSED for security
    const webhookSecret = Deno.env.get('VAPI_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('VAPI_WEBHOOK_SECRET not configured - rejecting webhook for security')
      return new Response(
        JSON.stringify({ error: 'Webhook authentication not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const signature = req.headers.get('x-vapi-signature')
    const isValid = await verifyVapiSignature(rawBody, signature, webhookSecret)
    if (!isValid) {
      console.error('Invalid webhook signature - possible forged request')
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    console.log('Webhook signature verified successfully')

    const body = JSON.parse(rawBody)
    console.log('Received Vapi webhook:', JSON.stringify(body, null, 2))

    const { message } = body

    // Vapi sends events in a 'message' wrapper
    if (!message) {
      console.log('No message in webhook payload')
      return new Response(
        JSON.stringify({ received: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { type, call } = message

    // Only process end-of-call reports
    if (type !== 'end-of-call-report') {
      console.log('Ignoring event type:', type)
      return new Response(
        JSON.stringify({ received: true, type }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!call) {
      console.log('No call data in end-of-call-report')
      return new Response(
        JSON.stringify({ received: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client with service role for bypassing RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Extract call data
    const {
      id: callId,
      assistantId,
      startedAt,
      endedAt,
      transcript,
      messages, // Vapi sends messages array here
      summary,
      recordingUrl,
      stereoRecordingUrl, // Fallback recording URL
      metadata, // Custom metadata including sessionId
    } = call

    // Extract session_id from metadata (passed when starting the call)
    const sessionId = metadata?.sessionId || null;

    // Calculate duration in seconds
    let durationSeconds = null
    if (startedAt && endedAt) {
      const start = new Date(startedAt).getTime()
      const end = new Date(endedAt).getTime()
      durationSeconds = Math.round((end - start) / 1000)
    }

    const finalRecordingUrl = recordingUrl || stereoRecordingUrl || null;

    console.log('Processing call:', {
      callId,
      assistantId,
      sessionId, // Log session ID for tracking
      durationSeconds,
      hasTranscript: !!transcript,
      hasMessages: !!(messages && messages.length),
      hasSummary: !!summary,
      recordingUrl: finalRecordingUrl,
    })

    // Find lead by agent_id
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, email')
      .eq('agent_id', assistantId)
      .single()

    if (leadError || !lead) {
      console.error('Lead not found for agent:', assistantId, leadError)
      // Still return 200 to acknowledge receipt
      return new Response(
        JSON.stringify({ error: 'Lead not found', assistantId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Found lead:', lead.id)

    // Create conversation record
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        lead_id: lead.id,
        agent_id: assistantId,
        call_id: callId,
        duration_seconds: durationSeconds,
        started_at: startedAt,
        ended_at: endedAt,
        transcript: transcript || null, // This is usually the string summary
        summary: summary || null,
        recording_url: finalRecordingUrl,
        session_id: sessionId, // Link to unified session
        channel: 'voice', // Mark as voice conversation
      })
      .select()
      .single()

    if (convError || !conversation) {
      console.error('Conversation creation error:', convError)
      return new Response(
        JSON.stringify({ error: 'Failed to save conversation', details: convError?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Created conversation:', conversation.id)

    // Save transcript messages if available
    // Use 'messages' array from Vapi, fallback to 'transcript' if it happens to be an array
    const messagesArray = (messages && Array.isArray(messages)) ? messages :
      (transcript && Array.isArray(transcript)) ? transcript : [];

    if (messagesArray.length > 0) {
      const formattedMessages = messagesArray.map((msg: any) => ({
        conversation_id: conversation.id,
        role: msg.role || 'unknown',
        content: msg.message || msg.content || '',
        timestamp: msg.time ? new Date(msg.time * 1000).toISOString() : new Date().toISOString(),
      }))

      const { error: msgError } = await supabase
        .from('transcript_messages')
        .insert(formattedMessages)

      if (msgError) {
        console.error('Transcript messages error:', msgError)
      } else {
        console.log('Saved', formattedMessages.length, 'transcript messages')
      }
    }

    // ... (previous code)

    console.log('Processed call for lead:', lead.id)

    // --- HighLevel Sync Start ---
    try {
      console.log('Starting HighLevel sync...')

      // 1. Get Integration Config
      const { data: integration, error: intError } = await supabase
        .from('integrations')
        .select('*')
        .eq('provider', 'highlevel')
        .single()

      if (intError || !integration) {
        console.log('Skipping HighLevel sync: No integration found.')
      } else {
        // 2. Get Valid Token
        // Dynamic import to avoid top-level await issues if any
        const { TokenManager } = await import('../_shared/token-manager.ts')

        const tokenManager = new TokenManager(
          supabaseUrl,
          supabaseServiceKey,
          integration.location_id
        )

        const accessToken = await tokenManager.getValidToken()

        if (!accessToken) {
          console.error('Failed to get valid HighLevel access token')
        } else {
          console.log('Got valid HighLevel token. Searching for contact...')

          // 3. Find Contact in HighLevel (by email)
          const searchUrl = `https://services.leadconnectorhq.com/contacts/search?email=${encodeURIComponent(lead.email)}`
          const searchResp = await fetch(searchUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Version': '2021-07-28',
              'Accept': 'application/json'
            }
          })

          const searchData = await searchResp.json()
          const contact = searchData.contacts?.[0]

          if (contact) {
            console.log('Found HighLevel contact:', contact.id)

            // 4. Update Contact (Add Tag)
            const updateResp = await fetch(`https://services.leadconnectorhq.com/contacts/${contact.id}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Version': '2021-07-28',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                tags: [...(contact.tags || []), 'Demo Completed']
              })
            })

            if (updateResp.ok) {
              console.log('Added "Demo Completed" tag to contact')
            } else {
              console.error('Failed to update contact tags', await updateResp.text())
            }

            // 5. Add Note with Summary
            if (summary) {
              const noteResp = await fetch(`https://services.leadconnectorhq.com/contacts/${contact.id}/notes`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Version': '2021-07-28',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  body: `AI Demo Call Summary:\n${summary}\n\nRecording: ${finalRecordingUrl || 'N/A'}`
                })
              })

              if (noteResp.ok) {
                console.log('Added call summary note to contact')
              } else {
                console.error('Failed to add note', await noteResp.text())
              }
            }

          } else {
            console.log('HighLevel contact not found for email:', lead.email)
          }
        }
      }
    } catch (hlError) {
      console.error('HighLevel Sync Error:', hlError)
      // Swallow error to not fail the webhook response
    }
    // --- HighLevel Sync End ---

    return new Response(
      JSON.stringify({
        success: true,
        conversationId: conversation.id,
        leadId: lead.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
