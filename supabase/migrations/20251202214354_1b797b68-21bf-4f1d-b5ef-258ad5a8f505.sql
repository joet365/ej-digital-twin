-- Drop unrestricted INSERT policies that allow anyone to insert data
-- Service role used by edge functions automatically bypasses RLS

DROP POLICY IF EXISTS "Service can insert conversations" ON conversations;
DROP POLICY IF EXISTS "Service can insert transcript messages" ON transcript_messages;