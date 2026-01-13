-- Create the client_knowledge_base table
CREATE TABLE IF NOT EXISTS client_knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL, -- 'podcast', 'website', 'pdf'
    source_url TEXT,
    title TEXT,
    content_chunk TEXT NOT NULL,
    embedding VECTOR(768), -- For Google's text-embedding-004
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE client_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage everything
CREATE POLICY "Service role can manage knowledge base" 
ON client_knowledge_base 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER update_client_knowledge_base_updated_at
    BEFORE UPDATE ON client_knowledge_base
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
