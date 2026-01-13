import os
import sys
import json
import argparse
import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = os.getenv("GOOGLE_SPREADSHEET_ID")
CREDENTIALS_FILE = os.getenv("GOOGLE_SHEETS_CREDENTIALS_JSON")

def update_sheet(leads_file, sheet_name):
    if not SPREADSHEET_ID or not CREDENTIALS_FILE:
        raise ValueError("GOOGLE_SPREADSHEET_ID or GOOGLE_SHEETS_CREDENTIALS_JSON not set in .env")

    try:
        creds = service_account.Credentials.from_service_account_file(
            CREDENTIALS_FILE, scopes=SCOPES)
        service = build('sheets', 'v4', credentials=creds)
        sheet = service.spreadsheets()

        with open(leads_file, "r") as f:
            leads = json.load(f)
            
        if not leads:
            print("No leads to upload.")
            return

        # Convert to DataFrame
        df = pd.DataFrame(leads)
        
        # Map Outscraper columns to Sheet columns
        upload_df = pd.DataFrame()
        
        upload_df['Name'] = df.get('name', '')
        upload_df['Address'] = df.get('full_address', '')
        upload_df['Phone'] = df.get('phone', '').apply(lambda x: f"'{x}" if x else '')
        upload_df['Website'] = df.get('site', '')
        upload_df['Rating'] = df.get('rating', '')
        upload_df['Reviews'] = df.get('reviews', '')
        upload_df['Email'] = df.get('email_1', '')
        upload_df['Email 2'] = df.get('email_2', '')
        upload_df['Facebook'] = df.get('facebook', '')
        upload_df['Instagram'] = df.get('instagram', '')
        upload_df['LinkedIn'] = df.get('linkedin', '')
        
        # Convert to string to handle nested data/nulls
        upload_df = upload_df.fillna('').astype(str)
        
        # Prepare values with headers
        values = [upload_df.columns.values.tolist()] + upload_df.values.tolist()
        
        body = {
            'values': values
        }
        
        # Clear existing data first (to ensure clean state with headers)
        sheet.values().clear(
            spreadsheetId=SPREADSHEET_ID,
            range=f"'{sheet_name}'!A1:ZZ"
        ).execute()
        
        # Update the sheet (Overwrite)
        result = sheet.values().update(
            spreadsheetId=SPREADSHEET_ID, 
            range=f"'{sheet_name}'!A1",
            valueInputOption="USER_ENTERED", 
            body=body
        ).execute()
        
        print(f"✅ {result.get('updates', {}).get('updatedCells')} cells updated in '{sheet_name}' sheet.")
        print(f"Link: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}")

    except Exception as e:
        print(f"Error updating sheet: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Upload Outscraper results to Google Sheet")
    parser.add_argument("file", help="JSON file containing Outscraper results")
    parser.add_argument("--sheet", required=True, help="Name of the Google Sheet tab")
    
    args = parser.parse_args()
    
    update_sheet(args.file, args.sheet)
