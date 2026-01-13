import os
import sys
import time
import requests
import json
from dotenv import load_dotenv

load_dotenv()

APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN")
ACTOR_ID = "compass~crawler-google-places"

import argparse


def run_actor(max_items, industry=None, location=None, keywords=None):
    if not APIFY_API_TOKEN:
        raise ValueError("APIFY_API_TOKEN not found in .env")

    url = f"https://api.apify.com/v2/acts/{ACTOR_ID}/runs?token={APIFY_API_TOKEN}"
    
    # Construct search terms
    search_terms = []
    if industry and location:
        search_terms.append(f"{industry} in {location}")
    elif industry:
        search_terms.append(industry)
    elif location:
        search_terms.append(location)
    
    if keywords:
        search_terms.append(keywords)
        
    # Payload for compass/crawler-google-places (Google Maps Scraper)
    payload = {
        "searchStringsArray": search_terms,
        "maxCrawledPlaces": max_items,
        "language": "en",
        "maxImages": 0,
        "maxReviews": 0,
    }
        
    print(f"Starting Apify actor {ACTOR_ID} with payload: {json.dumps(payload, indent=2)}")
    response = requests.post(url, json=payload)

    try:
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e}")
        print(f"Response Body: {response.text}")
        raise

    
    run_data = response.json()["data"]
    run_id = run_data["id"]
    dataset_id = run_data["defaultDatasetId"]
    print(f"Actor run started. Run ID: {run_id}")
    
    return run_id, dataset_id

def wait_for_run(run_id):
    url = f"https://api.apify.com/v2/actor-runs/{run_id}?token={APIFY_API_TOKEN}"
    
    while True:
        response = requests.get(url)
        data = response.json()["data"]
        status = data["status"]
        
        print(f"Run status: {status}")
        
        if status in ["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"]:
            return status
            
        time.sleep(5)

def get_dataset_items(dataset_id):
    url = f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_API_TOKEN}"
    response = requests.get(url)
    return response.json()


def main():
    parser = argparse.ArgumentParser(description="Scrape leads using Apify.")
    parser.add_argument("--max_items", type=int, default=25, help="Number of leads to fetch")
    parser.add_argument("--industry", type=str, help="Target industry")
    parser.add_argument("--location", type=str, help="Target location")
    parser.add_argument("--keywords", type=str, help="Additional keywords")
    
    args = parser.parse_args()
    
    try:
        run_id, dataset_id = run_actor(args.max_items, args.industry, args.location, args.keywords)
        status = wait_for_run(run_id)
        
        if status == "SUCCEEDED":
            items = get_dataset_items(dataset_id)
            print(json.dumps(items, indent=2))
            # Save to a temporary file for the next step
            with open("scraped_leads.json", "w") as f:
                json.dump(items, f, indent=2)
            print(f"Successfully scraped {len(items)} items. Saved to scraped_leads.json")
        else:
            print(f"Actor run failed with status: {status}", file=sys.stderr)
            sys.exit(1)
            
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
