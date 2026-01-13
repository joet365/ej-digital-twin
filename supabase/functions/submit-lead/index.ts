import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS_PER_WINDOW = 10 // 10 lead submissions per hour per IP
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getClientIP(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIP = req.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  return 'unknown'
}

function checkRateLimit(clientIP: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = rateLimitStore.get(clientIP)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetIn: RATE_LIMIT_WINDOW_MS }
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now }
  }

  record.count++
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetIn: record.resetTime - now }
}

// Input validation
function validateInput(data: any): { valid: boolean; error?: string } {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' }
  }
  if (data.name.length > 100) {
    return { valid: false, error: 'Name must be less than 100 characters' }
  }

  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Invalid email address' }
  }
  if (data.email.length > 255) {
    return { valid: false, error: 'Email must be less than 255 characters' }
  }

  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
    return { valid: false, error: 'Phone is required' }
  }
  const phoneRegex = /^[\d\s\-+()]+$/
  if (!phoneRegex.test(data.phone)) {
    return { valid: false, error: 'Invalid phone number' }
  }
  if (data.phone.length > 50) {
    return { valid: false, error: 'Phone must be less than 50 characters' }
  }

  if (!data.website || typeof data.website !== 'string') {
    return { valid: false, error: 'Website is required' }
  }
  try {
    new URL(data.website)
  } catch {
    return { valid: false, error: 'Invalid website URL' }
  }
  if (data.website.length > 500) {
    return { valid: false, error: 'Website must be less than 500 characters' }
  }

  if (!data.companyName || typeof data.companyName !== 'string' || data.companyName.trim().length === 0) {
    return { valid: false, error: 'Company name is required' }
  }
  if (data.companyName.length > 255) {
    return { valid: false, error: 'Company name must be less than 255 characters' }
  }

  return { valid: true }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Rate limiting
    const clientIP = getClientIP(req)
    const rateLimitResult = checkRateLimit(clientIP)

    if (!rateLimitResult.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`)
      return new Response(
        JSON.stringify({
          error: 'Too many requests. Please try again later.',
          resetIn: Math.ceil(rateLimitResult.resetIn / 1000)
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetIn / 1000))
          }
        }
      )
    }

    const body = await req.json()
    console.log('Received lead submission:', { ...body, email: '***' }) // Mask email in logs

    // Validate input
    const validation = validateInput(body)
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client with service role for insertion
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const normalizedEmail = body.email.trim().toLowerCase()

    // Check for existing lead with this email
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, agent_id, name, company_name')
      .eq('email', normalizedEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existingLead) {
      if (existingLead.agent_id) {
        // User already has a successful agent - redirect to demo
        console.log(`Returning user with existing agent: ${existingLead.id}`)
        return new Response(
          JSON.stringify({ 
            success: true, 
            redirect: true, 
            leadId: existingLead.id,
            agentId: existingLead.agent_id,
            name: existingLead.name,
            message: 'Welcome back! We found your existing demo.'
          }),
          { 
            status: 200, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'X-RateLimit-Remaining': String(rateLimitResult.remaining)
            } 
          }
        )
      } else {
        // Previous attempt failed - allow retry with existing lead
        console.log(`Retry for existing lead without agent: ${existingLead.id}`)
        return new Response(
          JSON.stringify({ 
            success: true, 
            retry: true, 
            leadId: existingLead.id,
            message: 'Retrying your demo...'
          }),
          { 
            status: 200, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'X-RateLimit-Remaining': String(rateLimitResult.remaining)
            } 
          }
        )
      }
    }

    // Insert new lead
    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert({
        name: body.name.trim(),
        email: normalizedEmail,
        phone: body.phone.trim(),
        website: body.website.trim(),
        company_name: body.companyName.trim(),
        consent_given: true,
        consent_timestamp: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to submit lead. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Lead created successfully: ${lead.id}`)

    // Sync to HighLevel
    try {
      await syncToHighLevel(lead)
    } catch (ghlError) {
      console.error('HighLevel sync error:', ghlError)
      // We don't fail the request if GHL sync fails, but we log it
    }

    return new Response(
      JSON.stringify({
        success: true,
        leadId: lead.id,
        remaining: rateLimitResult.remaining
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining)
        }
      }
    )
  } catch (error) {
    console.error('Error processing lead submission:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})



async function syncToHighLevel(lead: any) {
  console.log('Syncing to HighLevel via API...')

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Fetch token from database
  const { data: integration, error: fetchError } = await supabase
    .from('integrations')
    .select('*')
    .eq('provider', 'highlevel')
    .single()

  if (fetchError || !integration) {
    console.log('No HighLevel integration found. Skipping sync.')
    return
  }

  let accessToken = integration.access_token
  const locationId = integration.location_id

  // Check if token is expired or expiring soon (5 min buffer)
  const expiresAt = new Date(integration.expires_at).getTime()
  const now = Date.now()
  const buffer = 5 * 60 * 1000

  if (now + buffer >= expiresAt) {
    console.log('Token expired or expiring soon. Refreshing...')

    const clientId = Deno.env.get('HIGHLEVEL_CLIENT_ID')
    const clientSecret = Deno.env.get('HIGHLEVEL_CLIENT_SECRET')

    if (!clientId || !clientSecret) {
      console.error('Missing HIGHLEVEL_CLIENT_ID or HIGHLEVEL_CLIENT_SECRET')
      return
    }

    const refreshResponse = await fetch('https://services.leadconnectorhq.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: integration.refresh_token,
        user_type: 'Location'
      })
    })

    if (!refreshResponse.ok) {
      const errorText = await refreshResponse.text()
      console.error('Token refresh failed:', refreshResponse.status, errorText)
      throw new Error(`Token refresh failed: ${errorText}`)
    }

    const newTokens = await refreshResponse.json()
    const newExpiresAt = new Date(Date.now() + (newTokens.expires_in * 1000)).toISOString()

    // Update tokens in database
    await supabase
      .from('integrations')
      .update({
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        expires_at: newExpiresAt,
        updated_at: new Date().toISOString()
      })
      .eq('provider', 'highlevel')
      .eq('location_id', locationId)

    accessToken = newTokens.access_token
    console.log('Token refreshed successfully')
  }

  // Split name for HighLevel
  const nameParts = (lead.name || '').split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  const payload = {
    firstName,
    lastName,
    email: lead.email,
    phone: lead.phone,
    companyName: lead.company_name,
    website: lead.website,
    tags: ["Lead Form Submission"],
    locationId: locationId
  }

  const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`HighLevel API Error: ${response.status}`, errorText)
    throw new Error(`HighLevel API Failed: ${errorText}`)
  }

  const data = await response.json()
  console.log('HighLevel sync success, contact ID:', data.contact?.id)
}
