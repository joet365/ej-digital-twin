import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders })
    }

    try {
        const clientId = Deno.env.get('HIGHLEVEL_CLIENT_ID')
        if (!clientId) {
            return new Response(
                JSON.stringify({ error: 'HIGHLEVEL_CLIENT_ID not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get the base URL for the callback
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const redirectUri = `${supabaseUrl}/functions/v1/crm-oauth-callback`

        // Scopes needed for contact management
        const scopes = 'contacts.write contacts.readonly'

        // Build the authorization URL
        const authUrl = new URL('https://marketplace.leadconnectorhq.com/oauth/chooselocation')
        authUrl.searchParams.set('response_type', 'code')
        authUrl.searchParams.set('client_id', clientId)
        authUrl.searchParams.set('redirect_uri', redirectUri)
        authUrl.searchParams.set('scope', scopes)

        console.log('Generated OAuth URL:', authUrl.toString())

        return new Response(
            JSON.stringify({
                authUrl: authUrl.toString(),
                redirectUri: redirectUri,
                message: 'Click the authUrl to authorize your HighLevel account. After authorizing, you will be redirected back and tokens will be stored automatically.'
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    } catch (error) {
        console.error('Error generating OAuth URL:', error)
        return new Response(
            JSON.stringify({ error: 'Failed to generate OAuth URL' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
