class MusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.tracks = [];
    this.currentTrack = 0;
    this.isPlaying = false;
    this.isRepeat = false;
    
    this.initElements();
    this.initEvents();
    this.loadTracks();
  }

  initElements() {
    this.elements = {
      playerBtn: document.querySelector('.music-player-btn'),
      popup: document.querySelector('.music-player-popup'),
      playBtn: document.querySelector('.play-btn'),
      progressBar: document.querySelector('.progress-bar'),
      trackTitle: document.querySelector('.track-title'),
      trackArt: document.querySelector('.track-art')
    };
  }

  loadTracks() {
    this.tracks = [
      {
        title: "Track 1",
        artist: "Artist 1",
        art: "Music/album-art1.jpg",
        src: "Music/track1.mp3"
      }
      // Add more tracks
    ];
    this.loadTrack(0);
  }

  loadTrack(index) {
    const track = this.tracks[index];
    this.audio.src = track.src;
    this.elements.trackArt.src = track.art;
    this.elements.trackTitle.textContent = track.title;
  }

  initEvents() {
    this.elements.playerBtn.addEventListener('click', () => this.togglePopup());
    this.elements.playBtn.addEventListener('click', () => this.togglePlay());
    // Add other event listeners
  }

  togglePopup() {
    this.elements.popup.classList.toggle('active');
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  updateProgress() {
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    this.elements.progressBar.style.width = `${progress}%`;
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const player = new MusicPlayer();
});
