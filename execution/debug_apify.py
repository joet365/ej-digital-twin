import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN")

def debug_apify():
    if not APIFY_API_TOKEN:
        print("No token found")
        return

    # Check user info
    print("Checking user info...")
    url = f"https://api.apify.com/v2/users/me?token={APIFY_API_TOKEN}"
    resp = requests.get(url)
    if resp.status_code == 200:
        print(f"User: {resp.json()['data']['username']}")
    else:
        print(f"Error checking user: {resp.status_code} {resp.text}")

    # List actors (if any are saved)
    print("\nListing my actors...")
    url = f"https://api.apify.com/v2/acts?token={APIFY_API_TOKEN}"
    resp = requests.get(url)
    if resp.status_code == 200:
        actors = resp.json()['data']['items']
        for actor in actors:
            print(f"Actor: {actor['name']} (ID: {actor['id']}, Username: {actor.get('username')})")
    else:
        print(f"Error listing actors: {resp.status_code} {resp.text}")

    # Try to find the specific actor by search or store (not easily possible via simple API without search)
    # But we can try to get the specific actor details directly
    print("\nChecking specific actor 'code_crafter/leads-finder'...")
    url = f"https://api.apify.com/v2/acts/code_crafter~leads-finder?token={APIFY_API_TOKEN}" # Try tilde
    resp = requests.get(url)
    print(f"Tilde check: {resp.status_code}")

    url = f"https://api.apify.com/v2/acts/code_crafter/leads-finder?token={APIFY_API_TOKEN}" # Try slash
    resp = requests.get(url)
    print(f"Slash check: {resp.status_code}")

if __name__ == "__main__":
    debug_apify()
