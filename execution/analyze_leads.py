import sys
import json

def analyze_leads(leads_file, target_industry):
    try:
        with open(leads_file, "r") as f:
            leads = json.load(f)
            
        if not leads:
            print("No leads to analyze.")
            return 0.0

        relevant_count = 0
        total_count = len(leads)
        
        print(f"Analyzing {total_count} leads for industry: {target_industry}")
        
        for lead in leads:
            # Simple keyword matching for now
            # In a real scenario, this could use an LLM or fuzzy matching
            text_content = str(lead).lower()
            if target_industry.lower() in text_content:
                relevant_count += 1
                
        score = (relevant_count / total_count) * 100 if total_count > 0 else 0
        
        print(f"Relevance Score: {score:.2f}% ({relevant_count}/{total_count})")
        
        # Output the score to stdout for the directive to capture
        print(score)
        return score

    except Exception as e:
        print(f"Error analyzing leads: {e}", file=sys.stderr)
        sys.exit(1)

def main():
    if len(sys.argv) < 3:
        print("Usage: python analyze_leads.py <leads_json_file> <target_industry>")
        sys.exit(1)
        
    leads_file = sys.argv[1]
    target_industry = sys.argv[2]
    
    analyze_leads(leads_file, target_industry)

if __name__ == "__main__":
    main()
