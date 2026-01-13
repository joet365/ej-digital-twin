-- Add user_id to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Enable RLS on leads (if not already enabled)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own leads
CREATE POLICY "Users can view own leads"
ON public.leads
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can update their own leads
CREATE POLICY "Users can update own leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can insert their own leads
CREATE POLICY "Users can insert own leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all leads
CREATE POLICY "Admins can view all leads"
ON public.leads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Admins can update all leads
CREATE POLICY "Admins can update all leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
