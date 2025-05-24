class MusicPlayer {
    constructor() {
        this.isOpen = false;
        this.initElements();
        this.initEvents();
    }

    initElements() {
        this.elements = {
            player: document.querySelector('.music-player'),
            toggleBtn: document.querySelector('.music-toggle'),
            closeBtn: document.querySelector('.close-player')
        };
    }

    initEvents() {
        this.elements.toggleBtn.addEventListener('click', () => this.toggle());
        this.elements.closeBtn.addEventListener('click', () => this.toggle());
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.elements.player.classList.toggle('active');
        
        // Update button text
        const nowPlaying = this.elements.toggleBtn.querySelector('.now-playing');
        nowPlaying.textContent = this.isOpen ? 'Close Player' : 'Now Playing';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});
