#!/usr/bin/env python3
"""Test script to debug Outscraper emails_and_contacts API response"""

import os
import json
from dotenv import load_dotenv
from outscraper import ApiClient

load_dotenv()

OUTSCRAPER_API_KEY = os.getenv("OUTSCRAPER_API_KEY")

def test_api():
    if not OUTSCRAPER_API_KEY:
        raise ValueError("OUTSCRAPER_API_KEY not set in .env")
    
    client = ApiClient(api_key=OUTSCRAPER_API_KEY)
    
    # Test with a single website
    test_url = "https://www.lcbseniorliving.com/communities/residence-at-cherry-hill/"
    
    print(f"Testing Outscraper emails_and_contacts with: {test_url}\n")
    
    try:
        results = client.emails_and_contacts([test_url])
        
        print(f"Results type: {type(results)}")
        print(f"Results length: {len(results) if results else 0}\n")
        
        if results and len(results) > 0:
            print("First result:")
            print(json.dumps(results[0], indent=2))
        else:
            print("No results returned")
            
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api()
