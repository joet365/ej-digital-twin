#!/usr/bin/env python3
"""
Enrich leads in a Google Sheet with decision maker information using Outscraper.
"""

import os
import sys
import json
import argparse
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

def get_sheet_service():
    if not SPREADSHEET_ID or not CREDENTIALS_FILE:
        raise ValueError("GOOGLE_SPREADSHEET_ID or GOOGLE_SHEETS_CREDENTIALS_JSON not set in .env")
    
    creds = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE, scopes=SCOPES)
    service = build('sheets', 'v4', credentials=creds)
    return service.spreadsheets()

def get_leads(sheet_name, limit=None):
    """Read leads from Google Sheets"""
    sheet = get_sheet_service()
    
    # Read all data from the sheet
    result = sheet.values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=f"'{sheet_name}'!A:Z"
    ).execute()
    
    values = result.get('values', [])
    if not values:
        print("No data found in sheet")
        return [], []
    
    # Parse header
    header = values[0]
    
    # Get leads
    leads = []
    for i, row in enumerate(values[1:], start=2):  # Start at row 2 (1-indexed)
        # Pad row to match header length
        while len(row) < len(header):
            row.append('')
        
        row_dict = dict(zip(header, row))
        row_dict['_row_number'] = i
        leads.append(row_dict)
        
        if limit and len(leads) >= limit:
            break
    
    print(f"Found {len(leads)} leads in '{sheet_name}'")
    return leads, header

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
            enriched_leads.append({**lead, 'Enrichment Status': 'No website'})
            continue
        
        try:
            print(f"  🔍 Scraping {website}...")
            results = client.emails_and_contacts([website])
            
            if not results or len(results) == 0:
                print(f"  ⚠️  No results found")
                enriched_leads.append({**lead, 'Enrichment Status': 'No results'})
                continue
            
            website_data = results[0]
            emails = website_data.get('emails', [])
            
            if not emails:
                print(f"  ⚠️  No emails found")
                enriched_leads.append({**lead, 'Enrichment Status': 'No emails'})
                continue
            
            # Find decision maker
            decision_maker_keywords = ['vp', 'vice president', 'director', 'executive', 'ceo', 'president', 'owner', 'manager', 'founder', 'principal']
            decision_maker_contact = None
            
            # 1. Search for keywords in title/level
            for contact in emails:
                if isinstance(contact, dict):
                    title = contact.get('title', '').lower()
                    level = contact.get('level', '').lower()
                    for keyword in decision_maker_keywords:
                        if keyword in title or keyword in level:
                            decision_maker_contact = contact
                            break
                    if decision_maker_contact: break
            
            # 2. Fallback to any contact with a title
            if not decision_maker_contact:
                for contact in emails:
                    if isinstance(contact, dict) and contact.get('title'):
                        decision_maker_contact = contact
                        break
            
            # 3. Fallback to first email
            if not decision_maker_contact:
                decision_maker_contact = emails[0] if emails else None
            
            if decision_maker_contact and isinstance(decision_maker_contact, dict):
                email = decision_maker_contact.get('value', '')
                full_name = decision_maker_contact.get('full_name', '')
                title = decision_maker_contact.get('title', 'Contact')
                
                print(f"  ✅ Found: {full_name} ({title}) - {email}")
                
                enriched_leads.append({
                    **lead,
                    'Contact Name': full_name,
                    'Contact Title': title.title(),
                    'DM Email': email,
                    'Enrichment Status': 'Success'
                })
            else:
                print(f"  ⚠️  No valid contact found")
                enriched_leads.append({**lead, 'Enrichment Status': 'No valid contact'})
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            enriched_leads.append({**lead, 'Enrichment Status': f'Error: {str(e)[:50]}'})
    
    return enriched_leads

def update_google_sheet(enriched_leads, header, sheet_name):
    """Update the Google Sheet with enriched data"""
    sheet = get_sheet_service()
    
    # Determine columns to update/add
    # We want to add: Contact Name, Contact Title, DM Email
    new_columns = ['Contact Name', 'Contact Title', 'DM Email']
    
    # Check if columns exist, if not add them to header
    col_indices = {}
    current_header = list(header)
    
    # Update header in sheet if needed
    header_updates = []
    for col in new_columns:
        if col not in current_header:
            current_header.append(col)
            # Calculate column letter (e.g. 0->A, 25->Z, 26->AA)
            col_idx = len(current_header) - 1
            letter = ''
            while col_idx >= 0:
                letter = chr(col_idx % 26 + 65) + letter
                col_idx = col_idx // 26 - 1
            
            header_updates.append({
                'range': f"'{sheet_name}'!{letter}1",
                'values': [[col]]
            })
    
    if header_updates:
        print(f"Adding new columns: {new_columns}")
        sheet.values().batchUpdate(
            spreadsheetId=SPREADSHEET_ID,
            body={'valueInputOption': 'RAW', 'data': header_updates}
        ).execute()
        
        # Re-read header to get correct indices (lazy way) or just calculate
        # Let's just calculate indices based on current_header
    
    # Map column names to letters
    def get_col_letter(col_name):
        idx = current_header.index(col_name)
        letter = ''
        while idx >= 0:
            letter = chr(idx % 26 + 65) + letter
            idx = idx // 26 - 1
        return letter

    print(f"\nUpdating Google Sheet...")
    
    updates = []
    for lead in enriched_leads:
        row_num = lead['_row_number']
        
        for col in new_columns:
            if col in lead:
                letter = get_col_letter(col)
                updates.append({
                    'range': f"'{sheet_name}'!{letter}{row_num}",
                    'values': [[lead[col]]]
                })
    
    if not updates:
        print("No updates to make")
        return

    # Execute batch update
    result = sheet.values().batchUpdate(
        spreadsheetId=SPREADSHEET_ID,
        body={'valueInputOption': 'RAW', 'data': updates}
    ).execute()
    
    print(f"✅ Updated {len(enriched_leads)} rows in Google Sheet")

def main():
    parser = argparse.ArgumentParser(description="Enrich leads in Google Sheet")
    parser.add_argument("--sheet", required=True, help="Name of the Google Sheet tab")
    parser.add_argument("--limit", type=int, default=10, help="Number of leads to enrich")
    
    args = parser.parse_args()
    
    print(f"🚀 Enriching {args.limit} leads in '{args.sheet}'...\n")
    
    try:
        leads, header = get_leads(args.sheet, args.limit)
        if not leads: return
        
        enriched_leads = enrich_with_outscraper(leads)
        
        update_google_sheet(enriched_leads, header, args.sheet)
        
        print("\nDone!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
