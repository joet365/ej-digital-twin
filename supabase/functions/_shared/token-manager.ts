import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

export class TokenManager {
    private supabase: SupabaseClient
    private provider: string
    private locationId: string

    constructor(supabaseUrl: string, supabaseServiceKey: string, locationId: string, provider: string = 'highlevel') {
        this.supabase = createClient(supabaseUrl, supabaseServiceKey)
        this.provider = provider
        this.locationId = locationId
    }

    async getValidToken(): Promise<string | null> {
        // 1. Fetch current token from DB
        const { data, error } = await this.supabase
            .from('integrations')
            .select('*')
            .eq('provider', this.provider)
            .eq('location_id', this.locationId)
            .single()

        if (error || !data) {
            console.error(`TokenManager: No token found for ${this.provider} / ${this.locationId}`)
            return null
        }

        // 2. Check if expired (give 5 minute buffer)
        const expiresAt = new Date(data.expires_at).getTime()
        const now = new Date().getTime()
        const buffer = 5 * 60 * 1000

        if (now + buffer >= expiresAt) {
            console.log('TokenManager: Token expired or expiring soon. Refreshing...')
            return await this.refreshToken(data.refresh_token)
        }

        return data.access_token
    }

    private async refreshToken(refreshToken: string): Promise<string | null> {
        const clientId = Deno.env.get('HIGHLEVEL_CLIENT_ID')
        const clientSecret = Deno.env.get('HIGHLEVEL_CLIENT_SECRET')

        if (!clientId || !clientSecret) {
            console.error('TokenManager: Missing Client ID or Secret in environment')
            return null
        }

        try {
            const response = await fetch('https://services.leadconnectorhq.com/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    user_type: 'Location', // Assuming Location level app
                    redirect_uri: Deno.env.get('HIGHLEVEL_REDIRECT_URI') || 'https://oauth.lovable.app/callback'
                })
            })

            if (!response.ok) {
                const txt = await response.text()
                console.error(`TokenManager: Refresh failed ${response.status} - ${txt}`)
                return null
            }

            const newData = await response.json()

            // Calculate new expiry (expires_in is in seconds)
            const expiresAt = new Date(Date.now() + (newData.expires_in * 1000)).toISOString()

            // 3. Update DB
            const { error } = await this.supabase
                .from('integrations')
                .update({
                    access_token: newData.access_token,
                    refresh_token: newData.refresh_token,
                    expires_at: expiresAt,
                    updated_at: new Date().toISOString()
                })
                .eq('provider', this.provider)
                .eq('location_id', this.locationId)

            if (error) {
                console.error('TokenManager: Failed to update DB with new token', error)
            } else {
                console.log('TokenManager: DB updated with new token')
            }

            return newData.access_token

        } catch (e) {
            console.error('TokenManager: Exception during refresh', e)
            return null
        }
    }
}
