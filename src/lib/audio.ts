
const AUDIO_URLS = {
  boot: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // High tech boot
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Mechanical click
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Cyber success
  hover: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3', // Digital blip
  ambient: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Dark ambient placeholder
  glitch: 'https://assets.mixkit.co/active_storage/sfx/2521/2521-preview.mp3', // Glitch effect
  shock: 'https://assets.mixkit.co/active_storage/sfx/1715/1715-preview.mp3', // Explosion/Impact
  whisper: 'https://assets.mixkit.co/active_storage/sfx/1460/1460-preview.mp3' // Atmospheric whisper/drone
};

class SoundManager {
  private sounds: Record<string, HTMLAudioElement> = {};
  private ambient: HTMLAudioElement | null = null;
  private enabled: boolean = true;
  private initialized: boolean = false;

  init() {
    if (this.initialized) return;
    Object.entries(AUDIO_URLS).forEach(([key, url]) => {
      if (key === 'ambient') {
        this.ambient = new Audio(url);
        this.ambient.loop = true;
        this.ambient.volume = 0.08;
      } else {
        this.sounds[key] = new Audio(url);
        this.sounds[key].volume = 0.35;
      }
    });
    this.initialized = true;
  }

  play(name: keyof typeof AUDIO_URLS) {
    if (!this.enabled || !this.initialized) return;
    const s = this.sounds[name];
    if (s) {
      s.currentTime = 0;
      s.play().catch(() => {});
    }
  }

  toggleAmbient(force?: boolean) {
    if (!this.initialized) this.init();
    if (!this.ambient) return;
    const shouldPlay = force !== undefined ? force : this.ambient.paused;
    if (shouldPlay && this.enabled) {
      this.ambient.play().catch(() => {});
    } else {
      this.ambient.pause();
    }
  }

  welcome() {
    this.play('whisper');
  }

  boot() { 
    this.play('shock');
    setTimeout(() => this.play('glitch'), 400);
    setTimeout(() => this.play('click'), 1000); 
    setTimeout(() => this.play('boot'), 1500); 
    // Pulse ambient volume
    if (this.ambient) {
      const originalVol = this.ambient.volume;
      this.ambient.volume = 0.3; // Dramatic surge
      setTimeout(() => {
        if (this.ambient) this.ambient.volume = originalVol;
      }, 3000);
    }
  }
  
  glitch() { this.play('glitch'); }
  step() { this.play('click'); }
  success() { this.play('success'); }
  achievement() { this.play('success'); }
  hint() { this.play('hover'); }

  toggleAudio() {
    this.enabled = !this.enabled;
    this.toggleAmbient(this.enabled);
    return this.enabled;
  }
}

export const sounds = new SoundManager();
