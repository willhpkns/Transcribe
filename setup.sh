#!/bin/bash

echo "🎤 Setting up Audio Transcription Tool..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.7+ first."
    exit 1
fi

echo "✅ Python 3 found"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  ffmpeg not found. Installing via Homebrew..."
    if command -v brew &> /dev/null; then
        brew install ffmpeg
    else
        echo "❌ Homebrew not found. Please install ffmpeg manually:"
        echo "   brew install ffmpeg"
        echo "   or visit: https://ffmpeg.org/download.html"
        exit 1
    fi
fi

echo "✅ ffmpeg found"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📥 Installing Python packages..."
pip install --upgrade pip
pip install -r requirements.txt

echo
echo "🎉 Setup complete!"
echo
echo "To run the application:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Run the app: python app.py"
echo "3. Open your browser to: http://localhost:5001"
echo
echo "Note: The first time you run the app, it will download AI models."
echo "This may take a few minutes depending on your internet connection."
