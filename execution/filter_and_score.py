import os
import sys
import json
import glob
import asyncio
import pandas as pd
import gspread
from gspread_formatting import *
from playwright.async_api import async_playwright
from dotenv import load_dotenv

load_dotenv()

# Configuration
OUTPUT_DIR = "output"
SHEET_NAME = "Qualified Leads"
GOOGLE_CREDENTIALS_FILE = os.getenv("GOOGLE_SHEETS_CREDENTIALS_JSON")
GOOGLE_SPREADSHEET_ID = os.getenv("GOOGLE_SPREADSHEET_ID")

def get_latest_file():
    """Get the most recent JSON file from the output directory."""
    files = glob.glob(os.path.join(OUTPUT_DIR, "*.json"))
    if not files:
        return None
    return max(files, key=os.path.getctime)

def filter_leads(leads):
    """Filter leads based on criteria."""
    filtered = []
    for lead in leads:
        # Normalize fields (handle both Google Maps and Leads Finder formats)
        rating = lead.get('totalScore', lead.get('rating'))
        reviews = lead.get('reviewsCount', lead.get('reviews'))
        website = lead.get('website', lead.get('company_website'))
        
        # Criteria 1: Website must be valid
        if not website:
            continue
            
        # Criteria 2: Rating < 4.5 (or missing)
        # If rating is present, it must be < 4.5. If missing, we keep it (opportunity).
        if rating is not None and str(rating).strip() != '':
            try:
                if float(rating) >= 4.5:
                    continue
            except ValueError:
                pass # Keep if rating is weird
                
        # Criteria 3: Reviews < 50 (or missing)
        # If reviews is present, it must be < 50. If missing, we keep it.
        if reviews is not None and str(reviews).strip() != '':
            try:
                if int(reviews) >= 50:
                    continue
            except ValueError:
                pass
        
        filtered.append(lead)
    return filtered

async def check_website(page, url):
    """Check website for pixels and chat widgets."""
    try:
        # Add http if missing
        if not url.startswith('http'):
            url = 'http://' + url
            
        response = await page.goto(url, timeout=15000, wait_until="domcontentloaded")
        if not response:
            return False, False
            
        content = await page.content()
        content = content.lower()
        
        # Check for pixels
        pixel_indicators = ['fbevents.js', 'facebook-pixel', 'gtm-']
        pixel_found = any(ind in content for ind in pixel_indicators)
        
        # Check for chat
        chat_indicators = ['intercom', 'drift', 'tidio', 'chat-widget', 'highlevel', 'podium']
        chat_found = any(ind in content for ind in chat_indicators)
        
        return pixel_found, chat_found
        
    except Exception as e:
        # print(f"Error checking {url}: {e}")
        return False, False

async def enrich_leads(leads):
    """Enrich leads using Playwright."""
    print(f"Enriching {len(leads)} leads...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        enriched = []
        
        # Process in chunks to avoid overwhelming resources
        chunk_size = 5
        for i in range(0, len(leads), chunk_size):
            chunk = leads[i:i+chunk_size]
            tasks = []
            
            # Create a new page for each task to run in parallel
            pages = []
            for lead in chunk:
                page = await context.new_page()
                pages.append(page)
                website = lead.get('website', lead.get('company_website'))
                tasks.append(check_website(page, website))
            
            results = await asyncio.gather(*tasks)
            
            for j, (pixel_found, chat_found) in enumerate(results):
                lead = chunk[j].copy()
                lead['Pixel_Status'] = pixel_found
                lead['Chat_Status'] = chat_found
                
                # Scoring Logic
                if pixel_found and not chat_found:
                    lead['Lead_Score'] = 'HOT LEAD'
                else:
                    lead['Lead_Score'] = 'Warm Lead'
                
                # Default Outreach Status
                lead['Outreach_Status'] = 'To Contact'
                
                enriched.append(lead)
                
            # Close pages
            for page in pages:
                await page.close()
                
            print(f"Processed {min(i+chunk_size, len(leads))}/{len(leads)}")
            
        await browser.close()
        return enriched

def update_google_sheet(leads):
    """Update Google Sheet with enriched leads."""
    if not leads:
        print("No leads to upload.")
        return

    gc = gspread.service_account(filename=GOOGLE_CREDENTIALS_FILE)
    sh = gc.open_by_key(GOOGLE_SPREADSHEET_ID)
    
    try:
        worksheet = sh.worksheet(SHEET_NAME)
    except gspread.WorksheetNotFound:
        worksheet = sh.add_worksheet(title=SHEET_NAME, rows=1000, cols=20)
        # Add headers if new sheet
        headers = ['Name', 'Website', 'Phone', 'Rating', 'Reviews', 'Pixel_Status', 'Chat_Status', 'Lead_Score', 'Outreach_Status']
        worksheet.append_row(headers)
        # Format headers
        format_cell_range(worksheet, '1:1', CellFormat(textFormat=TextFormat(bold=True)))

    # Get existing websites to prevent duplicates
    existing_records = worksheet.get_all_records()
    existing_websites = set(str(r.get('Website', '')).lower().strip() for r in existing_records)
    
    # Prepare new rows
    new_rows = []
    for lead in leads:
        website = str(lead.get('website', lead.get('company_website', ''))).lower().strip()
        
        if website in existing_websites:
            continue
            
        # Map fields
        row = [
            lead.get('title', lead.get('name', lead.get('company_name', ''))),
            lead.get('website', lead.get('company_website', '')),
            lead.get('phone', lead.get('phoneUnformatted', '')),
            lead.get('totalScore', lead.get('rating', '')),
            lead.get('reviewsCount', lead.get('reviews', '')),
            str(lead.get('Pixel_Status')),
            str(lead.get('Chat_Status')),
            lead.get('Lead_Score'),
            lead.get('Outreach_Status')
        ]
        new_rows.append(row)
        existing_websites.add(website) # Add to set to prevent dupes within this batch
    
    if new_rows:
        worksheet.append_rows(new_rows)
        print(f"Added {len(new_rows)} new leads to '{SHEET_NAME}'.")
        
        # Apply Formatting
        apply_formatting(worksheet)
    else:
        print("No new leads to add (all duplicates).")

def apply_formatting(worksheet):
    """Apply conditional formatting and dropdowns."""
    
    # Define ranges (assuming headers are in row 1)
    # Outreach_Status is column I (9)
    # Lead_Score is column H (8)
    
    # Data Validation for Outreach_Status
    rule = DataValidationRule(
        condition=BooleanCondition('ONE_OF_LIST', ['To Contact', 'In Progress', 'Demo Booked', 'Not Interested']),
        showCustomUi=True
    )
    set_data_validation_for_cell_range(worksheet, 'I2:I1000', rule)
    
    # Conditional Formatting for Outreach_Status colors
    rules = get_conditional_format_rules(worksheet)
    
    # Remove old rules for these columns to avoid stacking
    # (Simplified: just adding new ones for now)
    
    # To Contact (Red)
    rules.append(ConditionalFormatRule(
        ranges=[GridRange.from_a1_range('I2:I1000', worksheet)],
        booleanRule=BooleanRule(
            condition=BooleanCondition('TEXT_EQ', ['To Contact']),
            format=CellFormat(backgroundColor=Color(1, 0.8, 0.8)) # Light Red
        )
    ))
    # In Progress (Yellow)
    rules.append(ConditionalFormatRule(
        ranges=[GridRange.from_a1_range('I2:I1000', worksheet)],
        booleanRule=BooleanRule(
            condition=BooleanCondition('TEXT_EQ', ['In Progress']),
            format=CellFormat(backgroundColor=Color(1, 1, 0.8)) # Light Yellow
        )
    ))
    # Demo Booked (Green)
    rules.append(ConditionalFormatRule(
        ranges=[GridRange.from_a1_range('I2:I1000', worksheet)],
        booleanRule=BooleanRule(
            condition=BooleanCondition('TEXT_EQ', ['Demo Booked']),
            format=CellFormat(backgroundColor=Color(0.8, 1, 0.8)) # Light Green
        )
    ))
    # Not Interested (Gray)
    rules.append(ConditionalFormatRule(
        ranges=[GridRange.from_a1_range('I2:I1000', worksheet)],
        booleanRule=BooleanRule(
            condition=BooleanCondition('TEXT_EQ', ['Not Interested']),
            format=CellFormat(backgroundColor=Color(0.9, 0.9, 0.9)) # Light Gray
        )
    ))
    
    # Lead_Score HOT LEAD (Green)
    rules.append(ConditionalFormatRule(
        ranges=[GridRange.from_a1_range('H2:H1000', worksheet)],
        booleanRule=BooleanRule(
            condition=BooleanCondition('TEXT_EQ', ['HOT LEAD']),
            format=CellFormat(
                backgroundColor=Color(0, 1, 0), # Bright Green
                textFormat=TextFormat(bold=True)
            )
        )
    ))
    
    rules.save()
    print("Formatting applied.")

async def main():
    # 1. Input Data
    input_file = get_latest_file()
    if not input_file:
        print("No input file found in output/ directory.")
        return
    
    print(f"Reading from: {input_file}")
    with open(input_file, 'r') as f:
        leads = json.load(f)
    
    print(f"Total raw leads: {len(leads)}")
    
    # 2. Filtering
    filtered_leads = filter_leads(leads)
    print(f"Leads after filtering (Rating < 4.5, Reviews < 50, Valid Website): {len(filtered_leads)}")
    
    if not filtered_leads:
        print("No leads passed the filter.")
        return
        
    # 3. Enrichment & Scoring
    enriched_leads = await enrich_leads(filtered_leads)
    
    # 4. Google Sheet Update
    update_google_sheet(enriched_leads)

if __name__ == "__main__":
    asyncio.run(main())
