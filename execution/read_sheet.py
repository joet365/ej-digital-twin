import os
import sys
from google.oauth2 import service_account
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = os.getenv("GOOGLE_SPREADSHEET_ID")
CREDENTIALS_FILE = os.getenv("GOOGLE_SHEETS_CREDENTIALS_JSON")

def read_sheet(sheet_name, max_rows=10):
    if not SPREADSHEET_ID or not CREDENTIALS_FILE:
        raise ValueError("GOOGLE_SPREADSHEET_ID or GOOGLE_SHEETS_CREDENTIALS_JSON not set in .env")

    try:
        creds = service_account.Credentials.from_service_account_file(
            CREDENTIALS_FILE, scopes=SCOPES)
        service = build('sheets', 'v4', credentials=creds)
        sheet = service.spreadsheets()

        # Read the data
        result = sheet.values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=f"'{sheet_name}'!A1:Z{max_rows}"
        ).execute()
        
        values = result.get('values', [])
        
        if not values:
            print(f"No data found in sheet '{sheet_name}'")
            return
        
        # Print header
        print(f"\nSheet: '{sheet_name}'")
        print(f"Columns: {', '.join(values[0])}")
        print(f"\nFirst {min(len(values)-1, max_rows-1)} rows:")
        print("-" * 80)
        
        # Print rows
        for i, row in enumerate(values[1:max_rows], 1):
            print(f"Row {i}: {row}")

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    sheet_name = sys.argv[1] if len(sys.argv) > 1 else "Lead Finder"
    max_rows = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    read_sheet(sheet_name, max_rows)
