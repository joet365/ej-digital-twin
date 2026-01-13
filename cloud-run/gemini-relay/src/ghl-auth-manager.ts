import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

export class GhlAuthManager {
    private supabase;

    constructor(supabaseUrl: string, supabaseKey: string) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    /**
     * Refreshes the GHL access token if it's expired or about to expire.
     * @param clientId The agent/client ID in Supabase
     */
    async getValidAccessToken(clientId: string): Promise<string | null> {
        try {
            const { data: integration, error } = await this.supabase
                .from('integrations')
                .select('*')
                .eq('agent_id', clientId)
                .eq('provider', 'highlevel')
                .single();

            if (error || !integration) {
                console.error('[GHL] No integration found for client:', clientId);
                return null;
            }

            const now = Math.floor(Date.now() / 1000);
            const expiresAt = integration.expires_at || 0;

            // If token is still valid (with 5 min buffer), return it
            if (expiresAt > now + 300) {
                return integration.access_token;
            }

            // Otherwise, refresh it
            console.log('[GHL] Token expired, refreshing...');
            return await this.refreshAccessToken(integration);
        } catch (err) {
            console.error('[GHL] Error retrieving access token:', err);
            return null;
        }
    }

    private async refreshAccessToken(integration: any): Promise<string | null> {
        const GHL_CLIENT_ID = process.env.GHL_CLIENT_ID;
        const GHL_CLIENT_SECRET = process.env.GHL_CLIENT_SECRET;

        if (!GHL_CLIENT_ID || !GHL_CLIENT_SECRET) {
            console.error('[GHL] Missing Client ID or Secret in environment');
            return null;
        }

        try {
            const params = new URLSearchParams();
            params.append('client_id', GHL_CLIENT_ID);
            params.append('client_secret', GHL_CLIENT_SECRET);
            params.append('grant_type', 'refresh_token');
            params.append('refresh_token', integration.refresh_token);

            interface GhlOAuthResponse {
                access_token: string;
                refresh_token: string;
                expires_in: number;
            }
            const response = await axios.post<GhlOAuthResponse>('https://services.leadconnectorhq.com/oauth/token', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const { access_token, refresh_token, expires_in } = response.data;
            const expiresAt = Math.floor(Date.now() / 1000) + expires_in;

            // Update Supabase
            const { error: updateError } = await this.supabase
                .from('integrations')
                .update({
                    access_token,
                    refresh_token,
                    expires_at: expiresAt,
                    updated_at: new Date().toISOString()
                })
                .eq('id', integration.id);

            if (updateError) {
                console.error('[GHL] Error updating tokens in Supabase:', updateError);
            }

            return access_token;
        } catch (err: any) {
            console.error('[GHL] Refresh failed:', err.response?.data || err.message);
            return null;
        }
    }
}
