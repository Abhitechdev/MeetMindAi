import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("No Supabase credentials found.")
    exit(1)

try:
    supabase: Client = create_client(url, key)
    
    meetings = supabase.table("meetings").select("*").limit(5).execute()
    print(f"Found {len(meetings.data)} meetings.")
    
    for m in meetings.data:
        print(f"- {m['title']} ({m['id']})")
        
    decisions = supabase.table("decisions").select("*").limit(5).execute()
    print(f"Found {len(decisions.data)} decisions.")
    
    actions = supabase.table("action_items").select("*").limit(5).execute()
    print(f"Found {len(actions.data)} actions.")
    
    try:
        commitments = supabase.table("commitments").select("*").limit(5).execute()
        print(f"Found {len(commitments.data)} commitments.")
    except Exception as e:
        print(f"Error checking commitments (maybe table doesn't exist?): {e}")

except Exception as e:
    print(f"Error connecting to Supabase: {e}")
