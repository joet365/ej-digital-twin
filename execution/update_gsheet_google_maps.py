import os
import sys
import json
import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = os.getenv("GOOGLE_SPREADSHEET_ID")
CREDENTIALS_FILE = os.getenv("GOOGLE_SHEETS_CREDENTIALS_JSON")
SHEET_NAME = "google maps new jersey senior living"

def update_sheet(leads_file):
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
        
        # Map Google Maps columns to Sheet columns
        upload_df = pd.DataFrame()
        
        upload_df['name'] = df.get('title', '')
        upload_df['email'] = ''
        upload_df['phone'] = df.get('phone', '')
        upload_df['website'] = df.get('website', '')
        upload_df['address'] = df.get('address', '')
        upload_df['city'] = df.get('city', '')
        upload_df['state'] = df.get('state', '')
        upload_df['zip'] = df.get('postalCode', '')
        
        # Add extra useful columns from Google Maps
        upload_df['rating'] = df.get('totalScore', '')
        upload_df['reviews'] = df.get('reviewsCount', '')
        
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
            range=f"'{SHEET_NAME}'!A1:ZZ"
        ).execute()
        
        # Update the sheet (Overwrite)
        result = sheet.values().update(
            spreadsheetId=SPREADSHEET_ID, 
            range=f"'{SHEET_NAME}'!A1",
            valueInputOption="USER_ENTERED", 
            body=body
        ).execute()

            
        print(f"{result.get('updates', {}).get('updatedCells')} cells updated in '{SHEET_NAME}' sheet.")
        print(f"Link: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}")

    except Exception as e:
        print(f"Error updating sheet: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python update_gsheet_google_maps.py <leads_json_file>")
        sys.exit(1)
        
    leads_file = sys.argv[1]
    update_sheet(leads_file)
