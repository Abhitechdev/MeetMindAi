import os
import requests
from dotenv import load_dotenv

load_dotenv("d:/MeetingMindAI/backend/.env")

url = "https://integrate.api.nvidia.com/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {os.getenv('NVIDIA_API_KEY')}",
    "Content-Type": "application/json"
}
data = {
    "model": "meta/llama-3.3-70b-instruct",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
}

try:
    print("Sending request...")
    r = requests.post(url, headers=headers, json=data, timeout=5)
    print("Status:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Error:", e)
