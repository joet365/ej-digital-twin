#!/usr/bin/env python3
"""
Script to identify and kill stuck Playwright/Node.js processes.
Usage: python3 execution/kill_stuck_processes.py [--force] [--dry-run]
"""

import sys
import psutil
import argparse
import os

def find_stuck_processes():
    """Find processes that look like stuck Playwright/Node agents."""
    stuck_procs = []
    
    # Patterns to look for
    suspicious_names = ['node']
    suspicious_cmdlines = [
        'playwright', 
        'run-driver', 
        'server-node.js',
        'extensionHost'
    ]
    
    for proc in psutil.process_iter(['pid', 'name', 'cmdline', 'create_time']):
        try:
            # Check if process matches suspicious criteria
            if proc.info['name'] in suspicious_names:
                cmdline = ' '.join(proc.info['cmdline'] or [])
                
                # Check for specific command line signatures
                is_suspicious = False
                for pattern in suspicious_cmdlines:
                    if pattern in cmdline:
                        is_suspicious = True
                        break
                
                if is_suspicious:
                    stuck_procs.append(proc)
                    
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
            
    return stuck_procs

def main():
    parser = argparse.ArgumentParser(description="Kill stuck Playwright/Node processes")
    parser.add_argument("--force", action="store_true", help="Kill processes without confirmation")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be killed without doing it")
    args = parser.parse_args()
    
    print("🔍 Scanning for stuck processes...")
    procs = find_stuck_processes()
    
    if not procs:
        print("✅ No suspicious processes found.")
        return
    
    print(f"\n⚠️  Found {len(procs)} potential stuck processes:")
    for p in procs:
        cmd = ' '.join(p.info['cmdline'] or [])[:100]  # Truncate long cmdlines
        print(f"  PID {p.info['pid']}: {cmd}...")
    
    if args.dry_run:
        print("\nRunning in dry-run mode. No processes were killed.")
        return
        
    if not args.force:
        response = input("\nDo you want to kill these processes? (y/N): ")
        if response.lower() != 'y':
            print("Operation cancelled.")
            return
            
    print("\n🔪 Killing processes...")
    killed_count = 0
    for p in procs:
        try:
            p.kill()
            print(f"  ✅ Killed PID {p.info['pid']}")
            killed_count += 1
        except psutil.NoSuchProcess:
            print(f"  ❌ PID {p.info['pid']} already gone")
        except psutil.AccessDenied:
            print(f"  ❌ Access denied for PID {p.info['pid']}")
            
    print(f"\nDone. Killed {killed_count} processes.")

if __name__ == "__main__":
    main()
