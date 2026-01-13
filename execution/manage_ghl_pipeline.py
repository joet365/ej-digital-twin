import requests
import os
import json
import pathlib
from dotenv import load_dotenv
try:
    from ghl_auth import get_ghl_credentials
except ImportError:
    # Fallback if running from root
    from execution.ghl_auth import get_ghl_credentials

# Load environment variables
script_dir = pathlib.Path(__file__).parent.resolve()
project_root = script_dir.parent
load_dotenv(project_root / ".env")
load_dotenv(project_root / ".env.local")

# Configuration
# Try to get from Supabase first
DB_ACCESS_TOKEN, DB_LOCATION_ID = get_ghl_credentials()

LOCATION_ID = DB_LOCATION_ID or "DXWeubAzD8IsRRpLZEbc" 
if os.getenv("HIGHLEVEL_LOCATION_ID"):
    LOCATION_ID = os.getenv("HIGHLEVEL_LOCATION_ID")

API_KEY = os.getenv("HIGHLEVEL_API_KEY")
ACCESS_TOKEN = DB_ACCESS_TOKEN or os.getenv("HIGHLEVEL_ACCESS_TOKEN")

# API Configuration
BASE_URL = "https://services.leadconnectorhq.com"

def get_headers():
    if ACCESS_TOKEN:
        return {
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Version": "2021-07-28",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    elif API_KEY:
        return {
            "Authorization": f"Bearer {API_KEY}",
            "Version": "2021-07-28",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    else:
        print("CRITICAL ERROR: No Authorization found.")
        print("Please set HIGHLEVEL_ACCESS_TOKEN or HIGHLEVEL_API_KEY in .env")
        return None

def get_pipelines():
    headers = get_headers()
    if not headers: return []
    
    url = f"{BASE_URL}/locations/{LOCATION_ID}/pipelines"
    print(f"Fetching pipelines from: {url}")
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data.get("pipelines", [])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching pipelines: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response: {e.response.text}")
        return []

def create_pipeline(name, stages):
    headers = get_headers()
    if not headers: return None
    
    url = f"{BASE_URL}/locations/{LOCATION_ID}/pipelines"
    
    payload = {
        "name": name,
        "stages": stages
    }
    
    print(f"Creating pipeline '{name}' with {len(stages)} stages...")
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        print(f"Successfully created pipeline '{name}': {data}")
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error creating pipeline '{name}': {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response: {e.response.text}")
        return None

def main():
    print("--- Managing HighLevel Pipelines ---")
    
    if not API_KEY and not ACCESS_TOKEN:
        print("SKIPPING: No credentials provided.")
        return

    existing_pipelines = get_pipelines()
    print(f"Found {len(existing_pipelines)} existing pipelines.")
    
    target_pipeline_name = "Outbound Sales"
    target_stages = [
        {"name": "New contact", "position": 1},
        {"name": "Called", "position": 2},
        {"name": "Not Interested", "position": 3},
        {"name": "Send Self Demo", "position": 4},
        {"name": "Schedule Sales Call", "position": 5},
        {"name": "Send Agreement", "position": 6},
        {"name": "Miss / No Show", "position": 7},
        {"name": "Not Interested (Closed/Lost)", "position": 8},
        {"name": "Won", "position": 9}
    ]
    
    # Check if pipeline exists
    pipeline_exists = False
    for pipeline in existing_pipelines:
        if pipeline.get('name') == target_pipeline_name:
            pipeline_exists = True
            print(f"✅ Pipeline '{target_pipeline_name}' already exists (ID: {pipeline.get('id')})")
            # Minimal output for now, assuming if it exists we might not want to overwrite/duplicate
            # In a more advanced version we could update stages
            break
            
    if not pipeline_exists:
        print(f"❌ Pipeline '{target_pipeline_name}' is MISSING. Creating...")
        create_pipeline(target_pipeline_name, target_stages)

if __name__ == "__main__":
    main()
