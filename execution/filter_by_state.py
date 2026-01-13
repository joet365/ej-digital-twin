#!/usr/bin/env python3
"""
Filter leads to only include those where the company is in a specific state.
Usage: python3 execution/filter_by_state.py input.json output.json "New Jersey"
"""

import sys
import json

def filter_by_company_state(input_file, output_file, target_state):
    with open(input_file, 'r') as f:
        leads = json.load(f)
    
    # Filter leads where company_state matches target_state
    filtered = []
    for lead in leads:
        company_state = lead.get('company_state')
        if company_state and company_state.lower() == target_state.lower():
            filtered.append(lead)
    
    print(f"Original leads: {len(leads)}")
    print(f"Filtered leads (company in {target_state}): {len(filtered)}")
    print(f"Filtered out: {len(leads) - len(filtered)}")
    
    # Save filtered results
    with open(output_file, 'w') as f:
        json.dump(filtered, f, indent=2)
    
    print(f"\nSaved filtered results to: {output_file}")
    
    return output_file

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 execution/filter_by_state.py input.json output.json 'State Name'")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    target_state = sys.argv[3]
    
    filter_by_company_state(input_file, output_file, target_state)
