# test_api.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.environ.get("GOOGLE_API_KEY")
print(f"API Key: {api_key[:5]}...{api_key[-4:]}")

try:
    genai.configure(api_key=api_key)
    print("Available models:")
    for m in genai.list_models():
        if 'gemini' in m.name.lower():
            print(f" - {m.name}")
    model = genai.GenerativeModel('gemini-1.5-flash')  # Option 1
    # or
    # model = genai.GenerativeModel('gemini-1.0-pro')  # Option 2
    response = model.generate_content("मला मदत करा")
    print("Success! Response:", response.text)
except Exception as e:
    print(f"Error: {type(e).__name__}: {str(e)}")