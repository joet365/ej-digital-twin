create table if not exists integrations (
  id uuid default uuid_generate_v4() primary key,
  provider text not null, -- e.g., 'highlevel'
  location_id text references leads(id), -- Optional link, or just store the GHL location_id string
  access_token text not null,
  refresh_token text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(provider, location_id)
);

-- RLS Policies (Secure it so only service role can read/write ideally, or authenticated users if needed)
alter table integrations enable row level security;

-- Only allow service role (or specific logic) to access tokens
create policy "Enable all access for service role only"
on integrations
to service_role
using (true)
with check (true);
