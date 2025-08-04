import os
import fitz  # PyMuPDF
import requests
from fastapi import FastAPI, UploadFile, File, Form

from fastapi.responses import FileResponse
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = "EXAVITQu4vr4xnSDxMaL"  # Change to your preferred voice ID or use a specific UUID

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text[:4900]  # ElevenLabs has a limit per request (~5000 chars)

def text_to_speech(text, output_path, voice_id):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "text": text,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    response = requests.post(url, json=payload, headers=headers, stream=True)

    if response.status_code == 200:
        with open(output_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
    else:
        raise Exception(f"Failed to generate audio: {response.text}")

@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    voice_id: str = Form(default="EXAVITQu4vr4xnSDxMaL")  # Default to Sarah
):
    try:
        temp_pdf = f"temp_{file.filename}"
        with open(temp_pdf, "wb") as f:
            f.write(await file.read())

        print(f"[INFO] Saved uploaded PDF to {temp_pdf}")

        text = extract_text_from_pdf(temp_pdf)
        print(f"[INFO] Extracted {len(text)} characters from PDF.")

        audio_path = "output.mp3"
        text_to_speech(text, audio_path, voice_id)
        print(f"[INFO] Audio saved to {audio_path}")

        os.remove(temp_pdf)
        return FileResponse(audio_path, media_type="audio/mpeg", filename="book_audio.mp3")

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        return {"error": str(e)}
