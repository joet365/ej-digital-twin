import os
import sys
from dotenv import load_dotenv

load_dotenv()

def main():
    try:
        # Your code here
        print("Execution script started")
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
