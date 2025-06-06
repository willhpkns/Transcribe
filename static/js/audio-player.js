// Audio Player with Synchronized Transcription Highlighting
class SyncedAudioPlayer {
    constructor(audioUrl, transcriptionData) {
        this.audioUrl = audioUrl;
        this.transcription = transcriptionData;
        this.audio = null;
        this.currentSegmentIndex = -1;
        this.isPlaying = false;
        this.updateInterval = null;
        
        this.initializePlayer();
        this.bindEvents();
    }
    
    initializePlayer() {
        // Create audio player HTML
        const playerHTML = `
            <div id="audio-player-container" class="audio-player">
                <div class="audio-controls">
                    <button id="play-pause-btn" class="control-btn">
                        <span class="play-icon">▶️</span>
                        <span class="pause-icon" style="display: none;">⏸️</span>
                    </button>
                    <button id="stop-btn" class="control-btn">⏹️</button>
                    <button id="rewind-btn" class="control-btn">⏪</button>
                    <button id="forward-btn" class="control-btn">⏩</button>
                    <div class="time-display">
                        <span id="current-time">00:00</span> / <span id="total-time">00:00</span>
                    </div>
                </div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div id="progress-fill" class="progress-fill"></div>
                        <input type="range" id="progress-slider" class="progress-slider" 
                               min="0" max="100" value="0" step="0.1">
                    </div>
                </div>
                <div class="volume-container">
                    <span class="volume-icon">🔊</span>
                    <input type="range" id="volume-slider" class="volume-slider" 
                           min="0" max="1" value="0.8" step="0.05">
                    <span class="volume-value">80%</span>
                </div>
                <div class="playback-speed">
                    <label>Speed:</label>
                    <select id="speed-select">
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1" selected>1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2x</option>
                    </select>
                </div>
            </div>
        `;
        
        // Insert player before transcription results
        const resultsContainer = document.querySelector('.transcription-results');
        if (resultsContainer) {
            resultsContainer.insertAdjacentHTML('beforebegin', playerHTML);
        }
        
        // Create audio element
        this.audio = new Audio(this.audioUrl);
        this.audio.preload = 'metadata';
        this.audio.volume = 0.8;
    }
    
    bindEvents() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const stopBtn = document.getElementById('stop-btn');
        const rewindBtn = document.getElementById('rewind-btn');
        const forwardBtn = document.getElementById('forward-btn');
        const progressSlider = document.getElementById('progress-slider');
        const volumeSlider = document.getElementById('volume-slider');
        const speedSelect = document.getElementById('speed-select');
        
        // Control buttons
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        stopBtn.addEventListener('click', () => this.stop());
        rewindBtn.addEventListener('click', () => this.skip(-10));
        forwardBtn.addEventListener('click', () => this.skip(10));
        
        // Progress and volume controls
        progressSlider.addEventListener('input', (e) => this.seekTo(e.target.value));
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        speedSelect.addEventListener('change', (e) => this.setPlaybackRate(e.target.value));
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.onAudioEnded());
        this.audio.addEventListener('error', (e) => this.onAudioError(e));
        
        // Make transcript segments clickable
        this.makeSegmentsClickable();
    }
    
    makeSegmentsClickable() {
        const segments = document.querySelectorAll('.transcript-segment');
        segments.forEach((segment, index) => {
            segment.style.cursor = 'pointer';
            segment.classList.add('clickable-segment');
            segment.title = 'Click to jump to this part of the audio';
            
            segment.addEventListener('click', () => {
                const startTime = this.transcription[index].start;
                this.seekToTime(startTime);
            });
        });
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayPauseButton();
            this.startHighlighting();
        }).catch(error => {
            console.error('Error playing audio:', error);
            this.showError('Failed to play audio. Please check the file format.');
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.stopHighlighting();
    }
    
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.clearHighlighting();
        this.stopHighlighting();
    }
    
    skip(seconds) {
        this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, this.audio.currentTime + seconds));
    }
    
    seekTo(percentage) {
        const duration = this.audio.duration;
        if (duration) {
            this.audio.currentTime = (percentage / 100) * duration;
        }
    }
    
    seekToTime(timeInSeconds) {
        this.audio.currentTime = timeInSeconds;
        if (!this.isPlaying) {
            this.play();
        }
    }
    
    setVolume(volume) {
        this.audio.volume = volume;
        const volumeValue = document.querySelector('.volume-value');
        if (volumeValue) {
            volumeValue.textContent = Math.round(volume * 100) + '%';
        }
    }
    
    setPlaybackRate(rate) {
        this.audio.playbackRate = parseFloat(rate);
    }
    
    updatePlayPauseButton() {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        
        if (this.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }
    
    updateDuration() {
        const duration = this.audio.duration;
        const totalTimeEl = document.getElementById('total-time');
        if (totalTimeEl && duration) {
            totalTimeEl.textContent = this.formatTime(duration);
        }
    }
    
    updateProgress() {
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration;
        
        if (duration) {
            const percentage = (currentTime / duration) * 100;
            
            // Update progress bar
            document.getElementById('progress-fill').style.width = percentage + '%';
            document.getElementById('progress-slider').value = percentage;
            
            // Update time display
            document.getElementById('current-time').textContent = this.formatTime(currentTime);
        }
    }
    
    startHighlighting() {
        this.updateInterval = setInterval(() => {
            this.highlightCurrentSegment();
        }, 100); // Update every 100ms for smooth highlighting
    }
    
    stopHighlighting() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    highlightCurrentSegment() {
        const currentTime = this.audio.currentTime;
        const currentSegment = this.findSegmentByTime(currentTime);
        
        if (currentSegment && currentSegment.index !== this.currentSegmentIndex) {
            // Clear previous highlighting
            this.clearHighlighting();
            
            // Highlight current segment - text only, no background
            const segmentElement = document.querySelector(`[data-segment-index="${currentSegment.index}"]`);
            if (segmentElement) {
                segmentElement.classList.add('active-segment');
                
                // Scroll into view if needed
                segmentElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                this.currentSegmentIndex = currentSegment.index;
            }
        }
    }
    
    clearHighlighting() {
        const activeSegments = document.querySelectorAll('.active-segment');
        activeSegments.forEach(segment => {
            segment.classList.remove('active-segment');
        });
        this.currentSegmentIndex = -1;
    }
    
    findSegmentByTime(currentTime) {
        for (let i = 0; i < this.transcription.length; i++) {
            const segment = this.transcription[i];
            if (currentTime >= segment.start && currentTime <= segment.end) {
                return { ...segment, index: i };
            }
        }
        return null;
    }
    
    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    onAudioEnded() {
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.clearHighlighting();
        this.stopHighlighting();
    }
    
    onAudioError(error) {
        console.error('Audio error:', error);
        this.showError('Audio playback error. Please check the file format or your internet connection.');
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'audio-error';
        errorDiv.innerHTML = `
            <div class="error-message">
                ⚠️ ${message}
            </div>
        `;
        
        const playerContainer = document.getElementById('audio-player-container');
        if (playerContainer) {
            playerContainer.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        }
    }
    
    destroy() {
        this.stopHighlighting();
        if (this.audio) {
            this.audio.pause();
            this.audio.src = '';
        }
        
        const playerContainer = document.getElementById('audio-player-container');
        if (playerContainer) {
            playerContainer.remove();
        }
    }
}

// Global variable to store the current player instance
let currentAudioPlayer = null;

// Function to initialize the audio player
function initializeAudioPlayer(audioUrl, transcriptionData) {
    // Destroy existing player if any
    if (currentAudioPlayer) {
        currentAudioPlayer.destroy();
    }
    
    // Create new player
    currentAudioPlayer = new SyncedAudioPlayer(audioUrl, transcriptionData);
    
}
