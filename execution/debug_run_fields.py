import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN")

# Get the latest run and print all its fields
url = f"https://api.apify.com/v2/actor-runs?token={APIFY_API_TOKEN}&status=SUCCEEDED&limit=1&desc=1"

response = requests.get(url)
all_runs = response.json()["data"]["items"]

# Filter for leads-finder runs
leads_finder_runs = [run for run in all_runs if run.get("actId") == "IoSHqwTR9YGhzccez"]

if leads_finder_runs:
    latest = leads_finder_runs[0]
    print("Available fields in Apify run:")
    print(json.dumps(latest, indent=2))
