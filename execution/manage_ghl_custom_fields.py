import requests
import os
import json
from dotenv import load_dotenv
try:
    from ghl_auth import get_ghl_credentials
except ImportError:
    # Fallback
    try:
        from execution.ghl_auth import get_ghl_credentials
    except ImportError:
        get_ghl_credentials = lambda: (None, None)

# Load environment variables
# Load environment variables
import pathlib
script_dir = pathlib.Path(__file__).parent.resolve()
project_root = script_dir.parent
load_dotenv(project_root / ".env")
load_dotenv(project_root / ".env.local")

# Try to get from Supabase first
DB_ACCESS_TOKEN, DB_LOCATION_ID = get_ghl_credentials()

LOCATION_ID = DB_LOCATION_ID or "DXWeubAzD8IsRRpLZEbc"
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

def get_custom_fields():
    headers = get_headers()
    if not headers: return []
    
    url = f"{BASE_URL}/locations/{LOCATION_ID}/customFields"
    print(f"Fetching custom fields from: {url}")
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data.get("customFields", [])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching custom fields: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response: {e.response.text}")
        return []

def create_custom_field(name, data_type="TEXT_BOX"):
    headers = get_headers()
    if not headers: return None
    
    url = f"{BASE_URL}/locations/{LOCATION_ID}/customFields"
    
    payload = {
        "name": name,
        "dataType": data_type,
        "placeholder": name,
        "model": "CONTACT"
    }
    
    print(f"Creating custom field '{name}'...")
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        print(f"Successfully created field '{name}': {data}")
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error creating custom field '{name}': {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response: {e.response.text}")
        return None

def main():
    print("--- Checking HighLevel Custom Fields ---")
    
    if not API_KEY and not ACCESS_TOKEN:
        print("SKIPPING: No credentials provided.")
        return

    existing_fields = get_custom_fields()
    print(f"Found {len(existing_fields)} existing custom fields.")
    
    existing_names = {field['name']: field for field in existing_fields}
    
    # Fields to verify/create
    required_fields = [
        {"name": "Setup Fee", "dataType": "MONETARY"},
        {"name": "Monthly Fee", "dataType": "MONETARY"},
        {"name": "Usage Fee", "dataType": "TEXT_BOX"}
    ]
    
    for field_info in required_fields:
        field_name = field_info["name"]
        if field_name in existing_names:
            print(f"✅ Field '{field_name}' already exists (ID: {existing_names[field_name]['id']})")
        else:
            print(f"❌ Field '{field_name}' is MISSING. Creating...")
            create_custom_field(field_name, field_info["dataType"])

if __name__ == "__main__":
    main()
