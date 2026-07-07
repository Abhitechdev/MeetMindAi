import sys
sys.path.append("d:/MeetingMindAI/backend")
from app.services.gemini_service import summarize

try:
    print("Testing summarize...")
    res = summarize("Hello, this is a test meeting. We decided to launch the product next week. Action item: Bob will prepare the launch plan.")
    print("Success:", res)
except Exception as e:
    print("Error:", str(e))
