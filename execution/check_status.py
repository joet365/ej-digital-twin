import requests
import os
import time
from dotenv import load_dotenv

load_dotenv()

token = os.getenv('APIFY_API_TOKEN')
url = f'https://api.apify.com/v2/actor-runs?token={token}&limit=1&desc=1'

print("Checking latest run status...")
try:
    resp = requests.get(url)
    resp.raise_for_status()
    data = resp.json()['data']['items']
    if data:
        run = data[0]
        print(f"Run ID: {run['id']}")
        print(f"Status: {run['status']}")
        print(f"Started: {run['startedAt']}")
    else:
        print("No runs found.")
except Exception as e:
    print(f"Error: {e}")
