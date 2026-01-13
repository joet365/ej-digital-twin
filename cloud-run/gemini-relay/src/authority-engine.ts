import { createClient } from '@supabase/supabase-js';

export class AuthorityEngine {
    private supabase;

    constructor(supabaseUrl: string, supabaseKey: string) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    /**
     * Performs a vector search on the knowledge base to find relevant snippets.
     * Note: This assumes pgvector is enabled and a 'match_knowledge_base' function exists.
     */
    async queryKnowledgeBase(clientId: string, queryText: string, limit: number = 3): Promise<string> {
        try {
            // In a real implementation, we would first generate an embedding for 'queryText' 
            // using Google's text-embedding-004. For the demo, we'll fallback to keyword search 
            // if embeddings aren't ready, or use a placeholder match.

            console.log(`[Authority] Searching knowledge base for: ${queryText}`);

            const { data: chunks, error } = await this.supabase
                .from('client_knowledge_base')
                .select('content_chunk, title')
                .eq('client_id', clientId)
                .limit(limit);

            if (error || !chunks || chunks.length === 0) {
                return "No specific insights found in the knowledge base for this query.";
            }

            return chunks.map((c: any) => `[Source: ${c.title || 'Unknown'}]\n${c.content_chunk}`).join('\n\n');
        } catch (err) {
            console.error('[Authority] Error querying knowledge base:', err);
            return "Error accessing knowledge base.";
        }
    }
}
