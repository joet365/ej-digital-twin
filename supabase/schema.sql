-- Conquer365 Database Schema
-- Database: Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  website VARCHAR(500) NOT NULL,
  
  -- Agent data
  agent_id VARCHAR(255),
  agent_config JSONB,
  
  -- Website scrape data
  website_content TEXT,
  scraped_at TIMESTAMP,
  
  -- Consent
  consent_given BOOLEAN DEFAULT FALSE,
  consent_timestamp TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  agent_id VARCHAR(255) NOT NULL,
  
  -- Call data
  call_id VARCHAR(255),
  duration_seconds INTEGER,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  
  -- Transcript and summary
  transcript JSONB,
  summary TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transcript messages table
CREATE TABLE transcript_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Message data
  role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_agent_id ON leads(agent_id);
CREATE INDEX idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX idx_conversations_call_id ON conversations(call_id);
CREATE INDEX idx_transcript_messages_conversation_id ON transcript_messages(conversation_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
