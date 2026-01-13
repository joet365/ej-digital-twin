import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def load_directive(filename):
    """Loads the content of a directive file."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    workspace_root = os.path.dirname(script_dir)
    directive_path = os.path.join(workspace_root, "directives", filename)
    
    if not os.path.exists(directive_path):
        raise FileNotFoundError(f"Directive file not found: {directive_path}")
        
    with open(directive_path, "r") as f:
        return f.read()

def generate_hooks(topic, platform="TikTok"):
    """Generates viral hooks using the Viral Engineer persona via Gemini."""
    print(f"Generating hooks for: {topic} on {platform} using Gemini...")
    
    if not GOOGLE_API_KEY:
        return "Error: GOOGLE_API_KEY not found in .env file. Please add it."

    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    system_prompt = load_directive("viral_engineer.md")
    
    user_content = f"""
    Topic: {topic}
    Platform: {platform}
    Brand Voice: Authoritative but Accessible
    """
    
    # Gemini doesn't have a separate "system" role in the same way as OpenAI for chat, 
    # but we can prepend it or use the system_instruction if supported, 
    # or just combine them. For 1.5 Flash, system_instruction is supported but 
    # simple concatenation works reliably across versions.
    
    full_prompt = f"{system_prompt}\n\n---\n\n{user_content}"
    
    try:
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        return f"Gemini Error: {e}"

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Generate Viral Hooks")
    parser.add_argument("--topic", required=True, help="Content Topic")
    parser.add_argument("--platform", default="TikTok", help="Target Platform")
    args = parser.parse_args()
    
    hooks = generate_hooks(args.topic, args.platform)
    print(hooks)
