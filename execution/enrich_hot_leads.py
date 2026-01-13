#!/usr/bin/env python3
"""
Enrich hot leads with decision maker information using Outscraper Emails and Contacts Scraper.
Reads from "Qualified Leads" sheet, enriches with decision maker emails/names, and updates the sheet.
"""

import os
import sys
import json
from datetime import datetime
from dotenv import load_dotenv
from outscraper import ApiClient
from google.oauth2 import service_account
from googleapiclient.discovery import build

load_dotenv()

# Configuration
OUTSCRAPER_API_KEY = os.getenv("OUTSCRAPER_API_KEY")
SPREADSHEET_ID = os.getenv("GOOGLE_SPREADSHEET_ID")
CREDENTIALS_FILE = os.getenv("GOOGLE_SHEETS_CREDENTIALS_JSON")
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

SHEET_NAME = "Qualified Leads"
OUTPUT_DIR = "output"

def get_hot_leads(limit=10):
    """Read hot leads from Google Sheets"""
    if not SPREADSHEET_ID or not CREDENTIALS_FILE:
        raise ValueError("GOOGLE_SPREADSHEET_ID or GOOGLE_SHEETS_CREDENTIALS_JSON not set in .env")
    
    creds = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE, scopes=SCOPES)
    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()
    
    # Read all data from the sheet
    result = sheet.values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=f"'{SHEET_NAME}'!A:L"
    ).execute()
    
    values = result.get('values', [])
    if not values:
        print("No data found in sheet")
        return []
    
    # Parse header
    header = values[0]
    
    # Find HOT LEADS
    hot_leads = []
    for i, row in enumerate(values[1:], start=2):  # Start at row 2 (1-indexed)
        # Pad row to match header length
        while len(row) < len(header):
            row.append('')
        
        row_dict = dict(zip(header, row))
        
        # Check if it's a HOT LEAD
        if row_dict.get('Lead_Score', '').upper() == 'HOT LEAD':
            row_dict['_row_number'] = i  # Store row number for later update
            hot_leads.append(row_dict)
            
            if len(hot_leads) >= limit:
                break
    
    print(f"Found {len(hot_leads)} HOT LEADS")
    return hot_leads, header

def enrich_with_outscraper(leads):
    """Use Outscraper to find decision maker emails from company websites"""
    if not OUTSCRAPER_API_KEY:
        raise ValueError("OUTSCRAPER_API_KEY not set in .env")
    
    client = ApiClient(api_key=OUTSCRAPER_API_KEY)
    enriched_leads = []
    
    print(f"\nEnriching {len(leads)} leads with Outscraper...")
    
    for i, lead in enumerate(leads, 1):
        website = lead.get('Website', '').strip()
        company_name = lead.get('Name', 'Unknown')
        
        print(f"\n[{i}/{len(leads)}] {company_name}")
        
        if not website:
            print(f"  ⚠️  No website found, skipping")
            enriched_leads.append({
                **lead,
                'Email ': 'No website',
                'Title': 'N/A'
            })
            continue
        
        try:
            # Use Outscraper Emails and Contacts Scraper
            # This scrapes emails from the website
            print(f"  🔍 Scraping {website}...")
            results = client.emails_and_contacts([website])

            
            if not results or len(results) == 0:
                print(f"  ⚠️  No results found")
                enriched_leads.append({
                    **lead,
                    'Email ': 'Not found',
                    'Title': 'N/A'
                })
                continue
            
            # Get the first result (website data)
            website_data = results[0]
            
            # Extract emails and names
            emails = website_data.get('emails', [])
            
            if not emails:
                print(f"  ⚠️  No emails found")
                enriched_leads.append({
                    **lead,
                    'Email ': 'Not found',
                    'Title': 'N/A'
                })
                continue
            
            # Try to find decision maker email (look for VP, Director, CEO, President, etc.)
            decision_maker_keywords = ['vp', 'vice president', 'director', 'executive', 'ceo', 'president', 'owner', 'manager']
            decision_maker_contact = None
            
            # First, try to find a contact with a decision maker title
            for contact in emails:
                if isinstance(contact, dict):
                    title = contact.get('title', '').lower()
                    level = contact.get('level', '').lower()
                    
                    # Check if title or level contains decision maker keywords
                    for keyword in decision_maker_keywords:
                        if keyword in title or keyword in level:
                            decision_maker_contact = contact
                            break
                    
                    if decision_maker_contact:
                        break
            
            # If no decision maker found, use the first contact with a title
            if not decision_maker_contact:
                for contact in emails:
                    if isinstance(contact, dict) and contact.get('title'):
                        decision_maker_contact = contact
                        break
            
            # If still no contact found, use the first email
            if not decision_maker_contact:
                decision_maker_contact = emails[0] if emails else None
            
            # Extract email, name, and title
            if decision_maker_contact and isinstance(decision_maker_contact, dict):
                email = decision_maker_contact.get('value', 'Not found')
                full_name = decision_maker_contact.get('full_name', 'Unknown')
                title = decision_maker_contact.get('title', 'Contact')
                
                print(f"  ✅ Found: {full_name} ({title}) - {email}")
                
                enriched_leads.append({
                    **lead,
                    'Name': full_name,  # Update the Name column with decision maker name
                    'Email ': email,
                    'Title': title.title(),  # Capitalize title
                    '_all_contacts': emails[:5]  # Store first 5 contacts for reference
                })
            else:
                print(f"  ⚠️  No valid contact found")
                enriched_leads.append({
                    **lead,
                    'Email ': 'Not found',
                    'Title': 'N/A'
                })

            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            enriched_leads.append({
                **lead,
                'Email ': f'Error: {str(e)[:50]}',
                'Title': 'N/A'
            })
    
    return enriched_leads

def update_google_sheet(enriched_leads, header):
    """Update the Google Sheet with enriched data"""
    if not SPREADSHEET_ID or not CREDENTIALS_FILE:
        raise ValueError("GOOGLE_SPREADSHEET_ID or GOOGLE_SHEETS_CREDENTIALS_JSON not set in .env")
    
    creds = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE, scopes=SCOPES)
    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()
    
    # Find column indices for Email and Title
    # Note: There are two "Name" columns. The first is Business Name (A), the second is Contact Name (B).
    # We'll assume the structure is fixed as: Name, Name, Email, Title...
    
    contact_name_col = 'B'
    email_col = 'C'
    title_col = 'D'
    
    print(f"\nUpdating Google Sheet...")
    print(f"Name column: {contact_name_col}, Email column: {email_col}, Title column: {title_col}")
    
    # Prepare batch update
    updates = []
    for lead in enriched_leads:
        row_num = lead['_row_number']
        name = lead.get('Name', '')
        email = lead.get('Email ', '')
        title = lead.get('Title', '')
        
        updates.append({
            'range': f"'{SHEET_NAME}'!{contact_name_col}{row_num}",
            'values': [[name]]
        })
        updates.append({
            'range': f"'{SHEET_NAME}'!{email_col}{row_num}",
            'values': [[email]]
        })
        updates.append({
            'range': f"'{SHEET_NAME}'!{title_col}{row_num}",
            'values': [[title]]
        })
    
    # Execute batch update
    body = {
        'valueInputOption': 'RAW',
        'data': updates
    }
    
    result = sheet.values().batchUpdate(
        spreadsheetId=SPREADSHEET_ID,
        body=body
    ).execute()
    
    print(f"✅ Updated {len(enriched_leads)} rows in Google Sheet")
    
    return result

def save_results(enriched_leads):
    """Save enriched results to JSON file"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"{OUTPUT_DIR}/enriched_hot_leads_{timestamp}.json"
    
    with open(output_file, 'w') as f:
        json.dump(enriched_leads, f, indent=2)
    
    print(f"\n💾 Saved results to {output_file}")
    return output_file

def main():
    limit = 10
    if len(sys.argv) > 1:
        limit = int(sys.argv[1])
    
    print(f"🚀 Enriching {limit} HOT LEADS with decision maker info...\n")
    
    try:
        # Step 1: Get hot leads from Google Sheets
        hot_leads, header = get_hot_leads(limit)
        
        if not hot_leads:
            print("No HOT LEADS found")
            return
        
        # Step 2: Enrich with Outscraper
        enriched_leads = enrich_with_outscraper(hot_leads)
        
        # Step 3: Save results
        output_file = save_results(enriched_leads)
        
        # Step 4: Update Google Sheet
        update_google_sheet(enriched_leads, header)
        
        # Summary
        print("\n" + "="*60)
        print("📊 ENRICHMENT SUMMARY")
        print("="*60)
        
        found_count = sum(1 for lead in enriched_leads if lead.get('Email ', '').strip() and 'Not found' not in lead.get('Email ', '') and 'Error' not in lead.get('Email ', ''))
        
        print(f"Total leads processed: {len(enriched_leads)}")
        print(f"Emails found: {found_count}")
        print(f"Success rate: {found_count/len(enriched_leads)*100:.1f}%")
        print(f"\nResults saved to: {output_file}")
        print(f"Google Sheet updated: {SHEET_NAME}")
        
    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
