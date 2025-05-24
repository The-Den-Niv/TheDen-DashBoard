class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.tracks = [];
    this.currentTrack = 0;
    this.isPlaying = false;
    this.isRepeat = false;
    this.volume = 0.7;
    
    this.initElements();
    this.initEvents();
    this.loadTracks();
    this.setupAudioListeners();
  }

  initElements() {
    this.elements = {
      playerContainer: document.querySelector('.music-player'),
      playerBtn: document.querySelector('.music-toggle'),
      playBtn: document.querySelector('.play-btn'),
      prevBtn: document.querySelector('.prev-btn'),
      nextBtn: document.querySelector('.next-btn'),
      repeatBtn: document.querySelector('.repeat-btn'),
      progressBar: document.querySelector('.progress-bar'),
      progressContainer: document.querySelector('.progress-container'),
      currentTime: document.querySelector('.current-time'),
      duration: document.querySelector('.duration'),
      trackTitle: document.querySelector('.song-title'),
      trackArtist: document.querySelector('.artist'),
      trackArt: document.querySelector('.album-art')
    };
  }

  loadTracks() {
    this.tracks = [
      {
        title: "Track 1",
        artist: "Artist 1",
        art: "Music/album-art1.jpg",
        src: "Music/track1.mp3"
      },
      {
        title: "Track 2", 
        artist: "Artist 2",
        art: "Music/album-art2.jpg",
        src: "Music/track2.mp3"
      }
    ];
    this.loadTrack(0);
  }

  loadTrack(index) {
    if (index < 0 || index >= this.tracks.length) return;
    
    this.currentTrack = index;
    const track = this.tracks[index];
    this.audio.src = track.src;
    this.elements.trackArt.src = track.art;
    this.elements.trackTitle.textContent = track.title;
    this.elements.trackArtist.textContent = track.artist;
    
    // Reset progress when loading new track
    this.elements.progressBar.style.width = '0%';
    this.elements.currentTime.textContent = '0:00';
    
    // Update duration when metadata is loaded
    this.audio.onloadedmetadata = () => {
      this.elements.duration.textContent = this.formatTime(this.audio.duration);
    };
  }

  setupAudioListeners() {
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.nextTrack());
    this.audio.volume = this.volume;
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.elements.trackArt.classList.remove('playing');
    } else {
      this.audio.play()
        .then(() => {
          this.elements.trackArt.classList.add('playing');
        })
        .catch(error => {
          console.error('Playback failed:', error);
        });
    }
    this.isPlaying = !this.isPlaying;
    this.updatePlayButton();
  }

  updatePlayButton() {
    const icon = this.isPlaying ? '❚❚' : '▶';
    this.elements.playBtn.textContent = icon;
  }

  nextTrack() {
    let nextIndex = this.currentTrack + 1;
    if (nextIndex >= this.tracks.length) {
      if (this.isRepeat) {
        nextIndex = 0;
      } else {
        this.togglePlay();
        return;
      }
    }
    this.loadTrack(nextIndex);
    if (this.isPlaying) this.audio.play();
  }

  prevTrack() {
    let prevIndex = this.currentTrack - 1;
    if (prevIndex < 0) {
      if (this.isRepeat) {
        prevIndex = this.tracks.length - 1;
      } else {
        return;
      }
    }
    this.loadTrack(prevIndex);
    if (this.isPlaying) this.audio.play();
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.elements.repeatBtn.classList.toggle('active', this.isRepeat);
  }

  updateProgress() {
    const { currentTime, duration } = this.audio;
    const progressPercent = (currentTime / duration) * 100;
    this.elements.progressBar.style.width = `${progressPercent}%`;
    this.elements.currentTime.textContent = this.formatTime(currentTime);
  }

  setProgress(e) {
    const width = this.elements.progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = this.audio.duration;
    this.audio.currentTime = (clickX / width) * duration;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  initEvents() {
    this.elements.playerBtn.addEventListener('click', () => this.togglePlayer());
    this.elements.playBtn.addEventListener('click', () => this.togglePlay());
    this.elements.prevBtn.addEventListener('click', () => this.prevTrack());
    this.elements.nextBtn.addEventListener('click', () => this.nextTrack());
    this.elements.repeatBtn.addEventListener('click', () => this.toggleRepeat());
    this.elements.progressContainer.addEventListener('click', (e) => this.setProgress(e));
  }

  togglePlayer() {
    this.elements.playerContainer.classList.toggle('active');
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const player = new MusicPlayer();
});
