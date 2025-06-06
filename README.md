# Audio Transcription Tool

A professional web-based transcription tool that can transcribe audio files and identify different speakers using AI. Built with OpenAI Whisper and pyannote.audio for enterprise-grade accuracy.

## Features

- 🎵 **Multi-format Support**: Upload MP3, WAV, M4A, FLAC, OGG, AAC, WebM files
- 🗣️ **AI-Powered Transcription**: Uses OpenAI Whisper for accurate speech recognition
- 👥 **Speaker Diarization**: Automatically identifies and separates different speakers
- 🌏 **Multi-language**: Supports English and Traditional Chinese
- 🎙️ **Live Recording**: Record audio directly in the browser with pause/resume controls
- 🌐 **Modern Web Interface**: Responsive design with drag-and-drop file upload
- 📝 **Export Results**: Download transcriptions with speaker identification
- ⚡ **Real-time Processing**: Live status updates during transcription

## Quick Start

### Prerequisites
- Python 3.7+
- ffmpeg (for audio processing)
- Hugging Face account (for speaker diarization)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd audio-transcription-tool
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure Hugging Face token in `config.py`:
   - Get your token from [Hugging Face](https://huggingface.co/settings/tokens)
   - Accept terms at [pyannote/speaker-diarization-3.1](https://huggingface.co/pyannote/speaker-diarization-3.1)

5. Run the application:
```bash
python app.py
```

6. Open your browser and go to `http://localhost:5001`

## Usage

### Web Interface
1. **Upload Audio**: Drag and drop or click to select audio files
2. **Choose Language**: Select English or Traditional Chinese
3. **Record Live**: Use the built-in recorder with pause/resume controls
4. **Process**: Click "Transcribe" to start AI processing
5. **Review Results**: View transcription with speaker identification
6. **Export**: Download results as formatted text

### API Endpoints
- `GET /` - Main web interface
- `POST /upload` - Upload and process audio files
- `GET /health` - System health check
- `GET /download/<filename>` - Download transcription results

## Technical Details

### Architecture
- **Backend**: Flask web framework with RESTful API
- **AI Models**: OpenAI Whisper (large) + pyannote.audio speaker diarization
- **Audio Processing**: librosa and soundfile for format conversion
- **Frontend**: Vanilla JavaScript with modern audio recording APIs

### Model Information
- **Whisper Model**: Configurable (tiny/base/small/medium/large)
- **Speaker Diarization**: pyannote/speaker-diarization-3.1
- **Audio Format Support**: Automatic conversion to compatible formats
- **Language Detection**: Automatic or manual language selection

## Configuration

Edit `config.py` to customize:
- Hugging Face authentication token
- Whisper model size (affects accuracy vs speed)
- Server host and port settings
- Enable/disable speaker diarization
- File size limits and supported formats

## Dependencies

### Core Libraries

### Core Libraries
- **Flask** (2.3.3) - Web framework
- **OpenAI Whisper** (20231117) - Speech recognition
- **pyannote.audio** (3.1.1) - Speaker diarization
- **torch** (2.1.0) - Deep learning framework
- **librosa** (0.10.1) - Audio processing
- **soundfile** (0.12.1) - Audio I/O

### System Requirements
- Python 3.7+
- ffmpeg (for audio processing)
- 4GB+ RAM (for large Whisper model)
- Hugging Face account with model access

## Troubleshooting

### Common Issues
1. **Model Loading Errors**: Ensure sufficient RAM and disk space
2. **Audio Format Issues**: Install ffmpeg properly
3. **Speaker Diarization Fails**: Check Hugging Face token and model access
4. **Slow Processing**: Consider using smaller Whisper model in config

### Performance Tips
- Use smaller Whisper models (base/small) for faster processing
- Convert large files to MP3 before upload
- Ensure stable internet for initial model downloads

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source. Please ensure you comply with the licenses of the underlying models:
- OpenAI Whisper: MIT License
- pyannote.audio: MIT License (requires Hugging Face account)

## Acknowledgments

- OpenAI for the Whisper speech recognition model
- Hugging Face and pyannote team for speaker diarization
- Flask community for the web framework
