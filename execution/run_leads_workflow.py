#!/usr/bin/env python3
"""
Workflow script to fetch Apify Leads Finder results and upload to Google Sheets.
Usage: python3 execution/run_leads_workflow.py "Sheet Name"
"""

import sys
import subprocess
import os

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 execution/run_leads_workflow.py 'Sheet Name'")
        print("\nExample: python3 execution/run_leads_workflow.py 'Attorneys Houston'")
        sys.exit(1)
    
    sheet_name = sys.argv[1]
    
    print(f"=== Leads Finder Workflow ===")
    print(f"Target Sheet: {sheet_name}\n")
    
    # Step 1: Fetch latest run
    print("Step 1: Fetching latest Apify run...")
    result = subprocess.run(
        ["python3", "execution/fetch_leads_finder.py"],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error fetching leads: {result.stderr}")
        sys.exit(1)
    
    print(result.stdout)
    
    # Extract output filename from the output
    output_file = None
    for line in result.stdout.split('\n'):
        if line.startswith("Saved to "):
            output_file = line.replace("Saved to ", "").strip()
            break
    
    if not output_file:
        print("Error: Could not determine output file")
        sys.exit(1)
    
    # Step 2: Update sheet name in upload script
    print(f"\nStep 2: Updating sheet name to '{sheet_name}'...")
    
    # Read the upload script
    upload_script = "execution/update_gsheet_leads_finder.py"
    with open(upload_script, 'r') as f:
        content = f.read()
    
    # Replace the SHEET_NAME line
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if line.startswith('SHEET_NAME = '):
            lines[i] = f'SHEET_NAME = "{sheet_name}"  # Updated sheet name'
            break
    
    # Write back
    with open(upload_script, 'w') as f:
        f.write('\n'.join(lines))
    
    print(f"Updated sheet name to: {sheet_name}")
    
    # Step 3: Upload to Google Sheets
    print(f"\nStep 3: Uploading to Google Sheets...")
    result = subprocess.run(
        ["python3", upload_script, output_file],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        print(f"Error uploading: {result.stderr}")
        sys.exit(1)
    
    print(result.stdout)
    print("\n=== Workflow Complete ===")

if __name__ == "__main__":
    main()
