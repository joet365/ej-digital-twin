# Conquer365 - Setup Instructions

## Prerequisites
- Supabase account (free tier)
- Vercel account (free tier)
- GitHub account

## Step 1: Setup Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL to create tables
5. Go to Settings → API
6. Copy your:
   - `Project URL` (SUPABASE_URL)
   - `service_role key` (SUPABASE_SERVICE_KEY)

## Step 2: Deploy Python Backend

The Python scripts (`build_voice_agent.py` and `deploy_voice_agent.py`) need to be accessible to the Vercel functions.

**Option A: Include in Vercel deployment**
1. Copy `execution/` folder to the repo root
2. Vercel will bundle it with the deployment

**Option B: Separate deployment**
1. Deploy Python scripts to Railway/Render
2. Update API to call via HTTP instead of exec

## Step 3: Configure Environment Variables

In Vercel dashboard, add these secrets:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# AI Services
OPENAI_API_KEY=sk-proj-...
FIRECRAWL_API_KEY=fc-...
VAPI_API_KEY=98f2c13e-...

# Python scripts path (if using Option A)
PYTHON_SCRIPT_PATH=/var/task/execution
```

## Step 4: Deploy to Vercel

```bash
cd kate-s-ai-receptionist
vercel
```

Follow prompts to link to your GitHub repo.

## Step 5: Configure Vapi Webhooks

1. Go to [Vapi Dashboard](https://dashboard.vapi.ai)
2. Settings → Webhooks
3. Add webhook URL: `https://your-app.vercel.app/api/webhook/vapi`
4. Enable events:
   - `call-started`
   - `call-ended`
   - `transcript-updated`

## Step 6: Update Frontend

The Lovable frontend is already configured to call `/api/generate-agent`.

Just make sure the environment variables are set in Lovable:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Step 7: Test

1. Visit your deployed site
2. Fill out the form
3. Watch it create a real agent
4. Test the voice conversation
5. Check Supabase to see saved data

## Troubleshooting

### Agent creation fails
- Check Vercel logs for Python script errors
- Verify API keys are correct
- Test Python scripts locally first

### Vapi webhook not working
- Check webhook URL is correct
- Verify webhook is enabled in Vapi dashboard
- Check Vercel logs for webhook errors

### Database errors
- Verify Supabase schema is created
- Check service_role key has write permissions
- Look at Supabase logs

## Admin Dashboard

To view leads and conversations:
1. Create an admin page in Lovable
2. Call `/api/admin/leads` to get all leads
3. Display in a table with conversation counts

## Next Steps

- Add authentication to admin dashboard
- Implement consent checkbox on form
- Add email notifications for new leads
- Create analytics dashboard
