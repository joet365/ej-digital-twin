import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
    try {
        const url = new URL(req.url)
        const code = url.searchParams.get('code')
        const error = url.searchParams.get('error')

        if (error) {
            console.error('OAuth error from HighLevel:', error)
            return new Response(
                `<html><body><h1>Authorization Failed</h1><p>Error: ${error}</p></body></html>`,
                { status: 400, headers: { 'Content-Type': 'text/html' } }
            )
        }

        if (!code) {
            return new Response(
                '<html><body><h1>Authorization Failed</h1><p>No authorization code received.</p></body></html>',
                { status: 400, headers: { 'Content-Type': 'text/html' } }
            )
        }

        console.log('Received OAuth code, exchanging for tokens...')

        // Get credentials
        const clientId = Deno.env.get('HIGHLEVEL_CLIENT_ID')!
        const clientSecret = Deno.env.get('HIGHLEVEL_CLIENT_SECRET')!
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

        const redirectUri = `${supabaseUrl}/functions/v1/crm-oauth-callback`

        // Exchange authorization code for tokens
        const tokenResponse = await fetch('https://services.leadconnectorhq.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                user_type: 'Location'
            })
        })

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text()
            console.error('Token exchange failed:', tokenResponse.status, errorText)
            return new Response(
                `<html><body><h1>Token Exchange Failed</h1><p>Status: ${tokenResponse.status}</p><p>${errorText}</p></body></html>`,
                { status: 500, headers: { 'Content-Type': 'text/html' } }
            )
        }

        const tokenData = await tokenResponse.json()
        console.log('Token exchange successful, locationId:', tokenData.locationId)

        // Calculate expiry time
        const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString()

        // Store tokens in database
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const { error: upsertError } = await supabase
            .from('integrations')
            .upsert({
                provider: 'highlevel',
                location_id: tokenData.locationId,
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_at: expiresAt,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'provider,location_id'
            })

        if (upsertError) {
            console.error('Failed to store tokens:', upsertError)
            return new Response(
                `<html><body><h1>Failed to Store Tokens</h1><p>${upsertError.message}</p></body></html>`,
                { status: 500, headers: { 'Content-Type': 'text/html' } }
            )
        }

        console.log('Tokens stored successfully for location:', tokenData.locationId)

        // Return success page
        return new Response(
            `<html>
        <head>
          <style>
            body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            .success { color: #16a34a; font-size: 48px; }
            h1 { color: #1f2937; }
            p { color: #6b7280; }
            .location { background: #f3f4f6; padding: 10px 20px; border-radius: 8px; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="success">✓</div>
          <h1>HighLevel Connected!</h1>
          <p>Your HighLevel account has been successfully connected.</p>
          <p class="location">Location ID: ${tokenData.locationId}</p>
          <p>Tokens will automatically refresh. You can close this window.</p>
        </body>
      </html>`,
            { status: 200, headers: { 'Content-Type': 'text/html' } }
        )

    } catch (error) {
        console.error('OAuth callback error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(
            `<html><body><h1>Error</h1><p>${errorMessage}</p></body></html>`,
            { status: 500, headers: { 'Content-Type': 'text/html' } }
        )
    }
})
