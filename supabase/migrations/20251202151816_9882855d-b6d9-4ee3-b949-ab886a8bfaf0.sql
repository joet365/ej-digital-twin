-- Enable RLS on leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Enable RLS on conversations table
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on transcript_messages table
ALTER TABLE public.transcript_messages ENABLE ROW LEVEL SECURITY;

-- Leads: Admins can view all leads
CREATE POLICY "Admins can view all leads"
ON public.leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Leads: Admins can insert leads
CREATE POLICY "Admins can insert leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Leads: Allow anonymous insert for public form submissions
CREATE POLICY "Public can submit leads"
ON public.leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Conversations: Admins can view all conversations
CREATE POLICY "Admins can view all conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Conversations: Allow service role to insert (from webhooks)
CREATE POLICY "Service can insert conversations"
ON public.conversations
FOR INSERT
TO anon
WITH CHECK (true);

-- Transcript messages: Admins can view all transcript messages
CREATE POLICY "Admins can view all transcript messages"
ON public.transcript_messages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Transcript messages: Allow service role to insert
CREATE POLICY "Service can insert transcript messages"
ON public.transcript_messages
FOR INSERT
TO anon
WITH CHECK (true);