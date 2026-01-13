import os
import sys
import json
import argparse
import requests
from dotenv import load_dotenv
from openai import OpenAI
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Load environment variables
load_dotenv()

# Configuration
FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GOOGLE_SERVICE_ACCOUNT_JSON = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")

def setup_google_docs():
    """Authenticates with Google Docs API."""
    if not GOOGLE_SERVICE_ACCOUNT_JSON or not os.path.exists(GOOGLE_SERVICE_ACCOUNT_JSON):
        print("Error: GOOGLE_SERVICE_ACCOUNT_JSON not set or file not found.")
        return None
    
    creds = service_account.Credentials.from_service_account_file(
        GOOGLE_SERVICE_ACCOUNT_JSON,
        scopes=['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive']
    )
    return build('docs', 'v1', credentials=creds), build('drive', 'v3', credentials=creds)

def scrape_website(url):
    """Scrapes the website using Firecrawl."""
    print(f"Scraping {url} with Firecrawl...")
    
    if not FIRECRAWL_API_KEY:
        raise ValueError("FIRECRAWL_API_KEY is missing.")

    headers = {"Authorization": f"Bearer {FIRECRAWL_API_KEY}"}
    
    # 1. Map the site (Optional, but good for finding subpages)
    # For now, we'll just use the 'scrape' endpoint with limit to get main content
    # or use the 'crawl' endpoint if we want deep scraping.
    # Let's stick to a simple scrape of the homepage + a few links if possible, 
    # but for this MVP, we'll scrape the provided URL directly.
    
    payload = {
        "url": url,
        "pageOptions": {
            "onlyMainContent": True
        }
    }
    
    response = requests.post("https://api.firecrawl.dev/v0/scrape", json=payload, headers=headers)
    
    if response.status_code != 200:
        print(f"Firecrawl Error: {response.text}")
        raise Exception("Failed to scrape website")
        
    data = response.json()
    if not data.get('success'):
        raise Exception(f"Firecrawl failed: {data}")
        
    markdown_content = data['data']['markdown']
    print(f"Successfully scraped {len(markdown_content)} characters.")
    return markdown_content

def analyze_brand(content):
    """Uses OpenAI to extract brand guidelines."""
    print("Analyzing brand with OpenAI...")
    
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is missing.")
        
    client = OpenAI(api_key=OPENAI_API_KEY)
    
def load_directive(filename):
    """Loads the content of a directive file."""
    # Assuming directives are in a 'directives' folder relative to the workspace root
    # We need to find the workspace root. For now, we'll assume the script is in execution/
    # and directives are in directives/ sibling folder.
    script_dir = os.path.dirname(os.path.abspath(__file__))
    workspace_root = os.path.dirname(script_dir)
    directive_path = os.path.join(workspace_root, "directives", filename)
    
    if not os.path.exists(directive_path):
        raise FileNotFoundError(f"Directive file not found: {directive_path}")
        
    with open(directive_path, "r") as f:
        return f.read()

def analyze_brand(content):
    """Uses OpenAI to extract brand guidelines."""
    print("Analyzing brand with OpenAI...")
    
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is missing.")
        
    client = OpenAI(api_key=OPENAI_API_KEY)
    
    # Load prompt dynamically
    try:
        system_prompt = load_directive("brand_strategist.md")
    except Exception as e:
        print(f"Error loading directive: {e}")
        return "Error: Could not load brand_strategist.md"
    
    user_content = f"""
    Here is the scraped website content. Analyze it and generate the brand guidelines.

    {content[:100000]} 
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ]
    )
    
    return response.choices[0].message.content

def create_google_doc(title, content, docs_service, drive_service):
    """Creates a Google Doc with the content."""
    print(f"Creating Google Doc: {title}...")
    
    # 1. Create blank doc
    doc_body = {'title': title}
    doc = docs_service.documents().create(body=doc_body).execute()
    doc_id = doc.get('documentId')
    
    # 2. Insert content
    # Note: Inserting raw markdown into GDocs is tricky. 
    # For this MVP, we will insert plain text. 
    # A robust solution would parse MD to Google Docs requests.
    
    requests_body = [
        {
            'insertText': {
                'location': {'index': 1},
                'text': content
            }
        }
    ]
    
    docs_service.documents().batchUpdate(documentId=doc_id, body={'requests': requests_body}).execute()
    
    # 3. Make it shareable (optional, or just print link)
    print(f"Google Doc created: https://docs.google.com/document/d/{doc_id}/edit")
    return doc_id

def main():
    parser = argparse.ArgumentParser(description="Generate Brand Guidelines from Website")
    parser.add_argument("--url", required=True, help="Website URL to scrape")
    args = parser.parse_args()
    
    try:
        # 1. Scrape
        content = scrape_website(args.url)
        
        # 2. Analyze
        brand_guidelines = analyze_brand(content)
        
        # 3. Save to Google Doc (if configured)
        docs_service, drive_service = setup_google_docs() or (None, None)
        
        if docs_service:
            doc_id = create_google_doc(f"Brand Guidelines - {args.url}", brand_guidelines, docs_service, drive_service)
        else:
            print("\n--- BRAND GUIDELINES (Local) ---\n")
            print(brand_guidelines)
            print("\n(Google Docs not configured, output printed above)")
            
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
