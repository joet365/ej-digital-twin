import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { GhlAuthManager } from './ghl-auth-manager';
import { AuthorityEngine } from './authority-engine';

export class ToolHandler {
    private ghlAuth;
    private authority;

    constructor(supabaseUrl: string, supabaseKey: string) {
        this.ghlAuth = new GhlAuthManager(supabaseUrl, supabaseKey);
        this.authority = new AuthorityEngine(supabaseUrl, supabaseKey);
    }

    /**
     * Main tool dispatcher
     */
    async handleToolCall(clientId: string, toolName: string, args: any): Promise<any> {
        console.log(`[Tools] Executing tool: ${toolName}`, args);

        switch (toolName) {
            case 'query_jeff_podcast':
                return await this.authority.queryKnowledgeBase(clientId, args.query);

            case 'push_lead_to_crm':
                return await this.pushLeadToGhl(clientId, args);

            case 'generate_marketing_image':
                return {
                    url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
                    description: "A premium Rochester real estate listing"
                };

            default:
                return { error: `Tool ${toolName} not found` };
        }
    }

    private async pushLeadToGhl(clientId: string, leadData: any) {
        const accessToken = await this.ghlAuth.getValidAccessToken(clientId);
        if (!accessToken) return { error: "Failed to authenticate with HighLevel" };

        try {
            const response = await axios.post<any>('https://services.leadconnectorhq.com/contacts/', {
                firstName: leadData.firstName,
                lastName: leadData.lastName,
                email: leadData.email,
                phone: leadData.phone,
                customFields: leadData.customFields
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Version': '2021-04-15',
                    'Content-Type': 'application/json'
                }
            });

            console.log('[Tools] Lead pushed to GHL:', response.data.contact?.id);
            return { success: true, contactId: response.data.contact?.id };
        } catch (err: any) {
            console.error('[Tools] GHL Push failed:', err.response?.data || err.message);
            return { error: "Failed to push lead to CRM" };
        }
    }

    /**
     * Returns the tool declaration for Gemini Setup
     */
    getToolDeclarations() {
        return [
            {
                name: "query_jeff_podcast",
                description: "Search Jeff Scofield's 'House Talk' podcast transcripts and advice to answer questions with his specific expertise.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        query: { type: "STRING", description: "The real estate topic or question to search for." }
                    },
                    required: ["query"]
                }
            },
            {
                name: "push_lead_to_crm",
                description: "Save the contact information to Jeff's CRM once the lead is qualified.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        firstName: { type: "STRING" },
                        lastName: { type: "STRING" },
                        email: { type: "STRING" },
                        phone: { type: "STRING" },
                        notes: { type: "STRING", description: "Any specific notes from the conversation." }
                    },
                    required: ["firstName", "phone"]
                }
            },
            {
                name: "generate_marketing_image",
                description: "Create a high-quality real estate marketing image for a property or post. Returns a URL.",
                parameters: {
                    type: "OBJECT",
                    properties: {
                        prompt: { type: "STRING", description: "The visual style or type of property (e.g. 'luxury Rochester condo')" }
                    },
                    required: ["prompt"]
                }
            }
        ];
    }
}
