import os
import json
import requests
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_API_KEY")

def load_directive(filename):
    """Loads the content of a directive file."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    workspace_root = os.path.dirname(script_dir)
    directive_path = os.path.join(workspace_root, "directives", filename)
    
    if not os.path.exists(directive_path):
        raise FileNotFoundError(f"Directive file not found: {directive_path}")
        
    with open(directive_path, "r") as f:
        return f.read()

def scrape_website(url, mock_mode=False):
    """Scrapes the website using Firecrawl."""
    print(f"Scraping {url}...")
    
    if mock_mode:
        return "MOCK WEBSITE CONTENT: We are a great company. We sell widgets."

    if not FIRECRAWL_API_KEY:
        raise ValueError("FIRECRAWL_API_KEY is missing.")

    payload = {
        "url": url,
        "formats": ["markdown"],
        "onlyMainContent": True
    }
    
    headers = {"Authorization": f"Bearer {FIRECRAWL_API_KEY}"}
    
    try:
        response = requests.post("https://api.firecrawl.dev/v1/scrape", json=payload, headers=headers)
        if response.status_code == 200:
            return response.json()['data']['markdown']
        else:
            print(f"Firecrawl Error: {response.text}")
            return None
    except Exception as e:
        print(f"Scraping failed: {e}")
        return None

def build_agent_config(website_content, mock_mode=False):
    """Uses the Architect Directive to build the agent config."""
    print("Architecting Voice Agent...")
    
    if mock_mode:
        return {
            "agent_name": "Mock Agent",
            "voice_id": "mock-voice-id",
            "system_prompt": "You are a mock agent.",
            "first_message": "Hello, I am a mock agent."
        }

    client = OpenAI(api_key=OPENAI_API_KEY)
    system_prompt = load_directive("voice_agent_architect.md")
    
    user_content = f"Here is the website content:\n\n{website_content[:50000]}" # Truncate to avoid context limits
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content}
        ],
        response_format={"type": "json_object"}
    )
    
    return json.loads(response.choices[0].message.content)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Build a Voice Agent from a URL")
    parser.add_argument("--url", required=True, help="Business Website URL")
    parser.add_argument("--mock", action="store_true", help="Run in mock mode")
    args = parser.parse_args()
    
    content = scrape_website(args.url, args.mock)
    if content:
        agent_config = build_agent_config(content, args.mock)
        print(json.dumps(agent_config, indent=2))
        
        # Save to file
        with open("agent_config.json", "w") as f:
            json.dump(agent_config, f, indent=2)
        print("Saved to agent_config.json")
    else:
        print("Failed to scrape website.")
