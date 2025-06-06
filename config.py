# Configuration file for Audio Transcription Tool

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Hugging Face Configuration
# For speaker diarization, you'll need a Hugging Face account and token
# 1. Create account at: https://huggingface.co/
# 2. Get your token from: https://huggingface.co/settings/tokens
# 3. Accept the terms for pyannote models at: https://huggingface.co/pyannote/speaker-diarization-3.1
# 4. Set your token in .env file: HUGGINGFACE_TOKEN="your_token_here"

# Hugging Face Token for Speaker Diarization
HUGGINGFACE_TOKEN = os.getenv("HUGGINGFACE_TOKEN")

# Speaker Diarization Settings
ENABLE_SPEAKER_DIARIZATION = True  # Set to Fal`se to disable speaker identification

# Whisper Model Settings
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "large")  # Options: tiny, base, small, medium, large
                                                     # Larger models are more accurate but slower

# Supported Languages
SUPPORTED_LANGUAGES = {
    "en": "English",
    "zh": "Chinese (Traditional/Simplified)"
}

# File Upload Settings
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "1000"))
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'm4a', 'flac', 'ogg', 'aac', 'webm'}

# Server Settings
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "5001"))
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
