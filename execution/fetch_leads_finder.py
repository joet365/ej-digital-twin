import os
import sys
import requests
import json
from dotenv import load_dotenv

load_dotenv()

APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN")
ACTOR_ID = "code_crafter~leads-finder"

def get_latest_run():
    """Get the most recent successful run of the Leads Finder actor"""
    if not APIFY_API_TOKEN:
        raise ValueError("APIFY_API_TOKEN not found in .env")
    
    # Get list of ALL runs for this actor (not just user's runs)
    # First, let's try getting runs from the actor's run history
    url = f"https://api.apify.com/v2/actor-runs?token={APIFY_API_TOKEN}&status=SUCCEEDED&limit=20&desc=1"

    
    print(f"Fetching recent runs...")
    response = requests.get(url)
    response.raise_for_status()
    
    all_runs = response.json()["data"]["items"]
    
    # Filter for leads-finder runs
    leads_finder_runs = [run for run in all_runs if run.get("actId") == "IoSHqwTR9YGhzccez"]
    
    if not leads_finder_runs:
        print("No successful Leads Finder runs found. Please run the actor in the Apify UI first.")
        print("\nSearching in all recent runs...")
        # Print what we found
        for run in all_runs[:5]:
            print(f"  - {run.get('actId')} at {run.get('startedAt')}")
        sys.exit(1)
    
    latest_run = leads_finder_runs[0]

    run_id = latest_run["id"]
    dataset_id = latest_run["defaultDatasetId"]
    started_at = latest_run["startedAt"]
    
    # Get the run label (File name / Run label from Apify UI)
    run_label = latest_run.get("buildId", "")  # This might be the label
    if not run_label:
        # Try to get from meta or options
        run_label = latest_run.get("options", {}).get("build", "query")
    
    # Clean the label for use in filename (remove spaces, special chars)
    import re
    if run_label:
        query_name = re.sub(r'[^\w\s-]', '', run_label).strip().replace(' ', '_').lower()
    else:
        query_name = "query"
    
    print(f"Found run from {started_at}")
    print(f"Run ID: {run_id}")
    print(f"Query: {query_name}")
    print(f"Dataset ID: {dataset_id}")
    
    return dataset_id, query_name

def get_dataset_items(dataset_id):
    """Download all items from the dataset"""
    url = f"https://api.apify.com/v2/datasets/{dataset_id}/items?token={APIFY_API_TOKEN}"
    
    print(f"Downloading results...")
    response = requests.get(url)
    response.raise_for_status()
    
    return response.json()

def main():
    import sys
    
    # Get query name from command line argument
    query_name = "query"
    if len(sys.argv) > 1:
        # Clean the query name for use in filename
        import re
        query_name = re.sub(r'[^\w\s-]', '', sys.argv[1]).strip().replace(' ', '_').lower()
    
    try:
        dataset_id, _ = get_latest_run()  # Ignore the extracted query_name
        items = get_dataset_items(dataset_id)
        
        print(f"Successfully downloaded {len(items)} leads")
        
        # Create output directory if it doesn't exist
        import os
        os.makedirs("output", exist_ok=True)
        
        # Generate filename with timestamp
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Use format: apify_[query_name]_[timestamp].json
        output_file = f"output/apify_{query_name}_{timestamp}.json"
        
        with open(output_file, "w") as f:
            json.dump(items, f, indent=2)
        
        print(f"Saved to {output_file}")
        
        # Print sample of first lead to show what data we have
        if items:
            print("\nSample lead data:")
            first_lead = items[0]
            print(f"  Name: {first_lead.get('full_name', first_lead.get('name', 'N/A'))}")
            print(f"  Email: {first_lead.get('email', 'N/A')}")
            print(f"  Phone: {first_lead.get('mobile_number', first_lead.get('phone', 'N/A'))}")
            print(f"  Company: {first_lead.get('company_name', 'N/A')}")
        
        # Return the filename so it can be used by the upload script
        return output_file
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    output_file = main()
    if output_file:
        print(f"\nTo upload to Google Sheets, run:")
        print(f"python3 execution/update_gsheet_leads_finder.py {output_file}")
