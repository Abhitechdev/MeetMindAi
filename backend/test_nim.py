import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv("d:/MeetingMindAI/backend/.env")

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY"),
)

try:
    response = client.chat.completions.create(
        model="meta/llama-3.3-70b-instruct",
        messages=[{"role": "user", "content": "Return exactly: hello world"}],
    )
    print("Success:", response.choices[0].message.content)
except Exception as e:
    print("Error:", str(e))
