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
SHEET_NAME = "Senior Living Decision Makers NJ"  # Updated sheet name

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

        # Convert to DataFrame for easy handling
        df = pd.DataFrame(leads)
        
        # Select and order important columns if they exist
        important_cols = ['name', 'email', 'phone', 'website', 'address', 'city', 'state', 'zip']
        available_cols = [col for col in important_cols if col in df.columns]
        
        # Add any remaining columns
        remaining_cols = [col for col in df.columns if col not in available_cols]
        final_cols = available_cols + remaining_cols
        
        df = df[final_cols]
        
        # Convert to string to handle nested data
        df = df.astype(str)
        
        values = [df.columns.values.tolist()] + df.values.tolist()
        
        body = {
            'values': values
        }
        
        # Check if sheet is empty to decide on headers
        result = sheet.values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=f"{SHEET_NAME}!A1:A1"
        ).execute()
        
        is_empty = not result.get('values')
        
        if is_empty:
            # If empty, write headers + data
            values = [df.columns.values.tolist()] + df.values.tolist()
        else:
            # If not empty, append data only (no headers)
            values = df.values.tolist()
        
        body = {
            'values': values
        }
        
        # Append to the sheet
        result = sheet.values().append(
            spreadsheetId=SPREADSHEET_ID, 
            range=f"{SHEET_NAME}!A1",
            valueInputOption="USER_ENTERED", 
            insertDataOption="INSERT_ROWS",
            body=body
        ).execute()
            
        print(f"{result.get('updatedCells')} cells updated in '{SHEET_NAME}' sheet.")
        print(f"Link: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}")

    except Exception as e:
        print(f"Error updating sheet: {e}", file=sys.stderr)
        sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("Usage: python update_gsheet_leads_finder.py <leads_json_file>")
        sys.exit(1)
        
    leads_file = sys.argv[1]
    update_sheet(leads_file)

if __name__ == "__main__":
    main()
