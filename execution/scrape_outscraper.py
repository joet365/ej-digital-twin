import os
import sys
import json
import argparse
from datetime import datetime
from outscraper import ApiClient
from dotenv import load_dotenv

load_dotenv()

OUTSCRAPER_API_KEY = os.getenv("OUTSCRAPER_API_KEY")
OUTPUT_DIR = "output"

def scrape_google_maps(query, limit=100, enrich_emails=True, language="en", region="us"):
    """
    Scrape Google Maps using Outscraper API.
    
    Args:
        query: Search query (e.g., "Senior Living in New Jersey")
        limit: Number of businesses to scrape
        enrich_emails: Whether to extract emails
        language: Language code (default: "en")
        region: Region code (default: "us")
    
    Returns:
        List of scraped businesses
    """
    if not OUTSCRAPER_API_KEY:
        raise ValueError("OUTSCRAPER_API_KEY not found in .env")
    
    # Initialize Outscraper client
    client = ApiClient(api_key=OUTSCRAPER_API_KEY)
    
    print(f"Starting Outscraper scrape...")
    print(f"Query: {query}")
    print(f"Limit: {limit}")
    print(f"Enrich Emails: {enrich_emails}")
    
    try:
        # Scrape Google Maps
        # Note: enrichment parameter takes a list of enrichment services
        # Available: domains_service, emails_validator_service, disposable_email_checker, 
        #            whatsapp_checker, imessage_checker, phones_enricher_service, etc.
        results = client.google_maps_search(
            query=[query],
            limit=limit,
            language=language,
            region=region,
            enrichment=['domains_service'] if enrich_emails else None
        )
        
        # Flatten results (Outscraper returns list of lists)
        businesses = []
        for result_set in results:
            if isinstance(result_set, list):
                businesses.extend(result_set)
            else:
                businesses.append(result_set)
        
        print(f"Successfully scraped {len(businesses)} businesses")
        
        # Count emails (Outscraper returns email_1, email_2, email_3)
        email_count = sum(1 for b in businesses if b.get('email_1'))
        print(f"Found emails for {email_count} businesses ({email_count/len(businesses)*100:.1f}%)")
        
        return businesses
        
    except Exception as e:
        print(f"Error during scraping: {e}", file=sys.stderr)
        raise

def save_results(businesses, query_name):
    """Save results to JSON file in output directory."""
    # Create output directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Generate filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"outscraper_{query_name}_{timestamp}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    # Save to file
    with open(filepath, 'w') as f:
        json.dump(businesses, f, indent=2)
    
    print(f"\nSaved {len(businesses)} businesses to: {filepath}")
    
    # Print sample
    if businesses:
        print("\nSample business:")
        sample = businesses[0]
        print(f"  Name: {sample.get('name', 'N/A')}")
        print(f"  Address: {sample.get('full_address', 'N/A')}")
        print(f"  Phone: {sample.get('phone', 'N/A')}")
        print(f"  Website: {sample.get('site', 'N/A')}")
        print(f"  Rating: {sample.get('rating', 'N/A')}")
        print(f"  Reviews: {sample.get('reviews', 'N/A')}")
        print(f"  Email 1: {sample.get('email_1', 'N/A')}")
        if sample.get('email_2'):
            print(f"  Email 2: {sample.get('email_2')}")
        if sample.get('email_3'):
            print(f"  Email 3: {sample.get('email_3')}")
    
    return filepath

def main():
    parser = argparse.ArgumentParser(description="Scrape Google Maps using Outscraper API")
    parser.add_argument("--query", type=str, required=True, help="Search query (e.g., 'Senior Living in New Jersey')")
    parser.add_argument("--limit", type=int, default=100, help="Number of businesses to scrape (default: 100, max free: 500)")
    parser.add_argument("--enrich-emails", action="store_true", default=True, help="Extract emails (default: True)")
    parser.add_argument("--no-emails", dest="enrich_emails", action="store_false", help="Skip email extraction")
    parser.add_argument("--language", type=str, default="en", help="Language code (default: en)")
    parser.add_argument("--region", type=str, default="us", help="Region code (default: us)")
    parser.add_argument("--query-name", type=str, help="Custom name for output file (default: derived from query)")
    
    args = parser.parse_args()
    
    # Generate query name for filename if not provided
    if not args.query_name:
        # Clean query for filename (remove special chars, lowercase, replace spaces with underscores)
        query_name = args.query.lower().replace(" ", "_")
        query_name = "".join(c for c in query_name if c.isalnum() or c == "_")
    else:
        query_name = args.query_name
    
    try:
        # Scrape
        businesses = scrape_google_maps(
            query=args.query,
            limit=args.limit,
            enrich_emails=args.enrich_emails,
            language=args.language,
            region=args.region
        )
        
        if not businesses:
            print("No businesses found. Try broadening your search query.")
            sys.exit(1)
        
        # Save
        filepath = save_results(businesses, query_name)
        
        print(f"\n✅ Success! Next steps:")
        print(f"1. Review the results: cat {filepath} | jq '.[0]'")
        print(f"2. Filter & score: python3 execution/filter_and_score.py")
        print(f"3. Or upload directly: python3 execution/update_gsheet_outscraper.py {filepath}")
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
