import os
import requests
import pathlib
from dotenv import load_dotenv

# Load environment variables
script_dir = pathlib.Path(__file__).parent.resolve()
project_root = script_dir.parent
load_dotenv(project_root / ".env")
load_dotenv(project_root / ".env.local")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    # Try alternate names
    SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not SUPABASE_KEY:
        # Fallback to anon key (might not work for secure tables, but worth a try)
        SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

def get_ghl_credentials():
    """
    Fetches the HighLevel access token and location ID from Supabase integrations table.
    Returns (access_token, location_id) or (None, None).
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Supabase credentials not found in .env")
        return None, None

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Query integrations table
    url = f"{SUPABASE_URL}/rest/v1/integrations?provider=eq.highlevel&select=access_token,location_id"
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        if not data:
            print("Error: No HighLevel integration found in Supabase.")
            return None, None
            
        record = data[0]
        return record.get('access_token'), record.get('location_id')
        
    except Exception as e:
        print(f"Error fetching from Supabase: {e}")
        return None, None
