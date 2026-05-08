
class SynthSpace {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  public enabled: boolean = true;
  private isAmbientPlaying: boolean = false;
  private currentDay: number = 1;

  // Active audio nodes for ambient
  private drone1: OscillatorNode | null = null;
  private drone2: OscillatorNode | null = null;
  private pulseLfo: OscillatorNode | null = null;
  private pulseGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.5;
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  init() {
    this.initCtx();
  }

  setDay(day: number) {
    this.currentDay = day;
    if (this.isAmbientPlaying) {
      this.updateAmbientTheme();
    }
  }

  playBeep(freq: number, type: OscillatorType, duration: number, vol = 0.1) {
    if (!this.enabled) return;
    this.initCtx();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start();
    osc.stop(this.ctx!.currentTime + duration);
  }

  playNoise(duration: number, vol = 0.1) {
    if (!this.enabled) return;
    this.initCtx();
    const bufferSize = this.ctx!.sampleRate * duration;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx!.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    
    const gain = this.ctx!.createGain();
    gain.gain.setValueAtTime(vol, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + duration);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);
    
    noise.start();
  }

  boot() {
    if (!this.enabled) return;
    this.initCtx();
    const t = this.ctx!.currentTime;
    
    // Deep sub drop
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 1.5);
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    osc.connect(gain).connect(this.masterGain!);
    osc.start();
    osc.stop(t + 1.5);

    // Digital startup hum
    setTimeout(() => {
      this.playBeep(440, 'square', 0.1, 0.05);
      setTimeout(() => this.playBeep(880, 'square', 0.2, 0.05), 100);
      setTimeout(() => this.playBeep(1760, 'sine', 0.4, 0.1), 250);
    }, 400);
  }

  startAmbient() {
    if (!this.enabled || this.isAmbientPlaying) return;
    this.initCtx();
    this.isAmbientPlaying = true;
    
    this.ambientGain = this.ctx!.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.03, this.ctx!.currentTime + 5);
    this.ambientGain.connect(this.masterGain!);

    // Drones
    this.drone1 = this.ctx!.createOscillator();
    this.drone2 = this.ctx!.createOscillator();
    
    // Filter
    this.filter = this.ctx!.createBiquadFilter();
    
    // Pulse section
    const pulseVca = this.ctx!.createGain();
    this.pulseGain = this.ctx!.createGain();
    this.pulseLfo = this.ctx!.createOscillator();
    
    this.pulseLfo.type = 'sine';
    this.pulseLfo.connect(this.pulseGain.gain);
    this.pulseGain.connect(pulseVca.gain);
    // base amplitude of pulse volume modulation
    pulseVca.gain.value = 0.5;

    this.drone1.connect(this.filter);
    this.drone2.connect(this.filter);
    
    // Connect filter to main ambient gain and to the pulse VCA
    this.filter.connect(this.ambientGain);
    this.filter.connect(pulseVca);
    pulseVca.connect(this.ambientGain);

    this.drone1.start();
    this.drone2.start();
    this.pulseLfo.start();

    // Set theme based on current day
    this.updateAmbientTheme();
  }

  updateAmbientTheme() {
    if (!this.ctx || !this.drone1 || !this.drone2 || !this.filter || !this.pulseLfo || !this.pulseGain) return;
    const t = this.ctx.currentTime;
    
    if (this.currentDay <= 10) {
      // Days 1-10 (Очищение): Treacherous, cold ambient, discomfort, glitches
      this.drone1.type = 'triangle';
      this.drone1.frequency.setTargetAtTime(55, t, 1); // Low A
      
      this.drone2.type = 'triangle';
      this.drone2.frequency.setTargetAtTime(56.5, t, 1); // Dissonant minor 9th feel beating
      
      this.filter.type = 'bandpass';
      this.filter.frequency.setTargetAtTime(200, t, 1);
      this.filter.Q.setTargetAtTime(2, t, 1); // Less sharp, softer discomfort
      
      this.pulseGain.gain.setTargetAtTime(0, t, 1); // No pulse yet
      
    } else if (this.currentDay <= 20) {
      // Days 11-20 (Накопление): Denser, lower, confident, rhythmic pulse
      this.drone1.type = 'sine';
      this.drone1.frequency.setTargetAtTime(65.41, t, 1); // C2
      
      this.drone2.type = 'triangle';
      this.drone2.frequency.setTargetAtTime(32.7, t, 1); // C1 sub
      
      this.filter.type = 'lowpass';
      this.filter.frequency.setTargetAtTime(120, t, 1); // Deep, muffled
      this.filter.Q.setTargetAtTime(1, t, 1);
      
      this.pulseGain.gain.setTargetAtTime(0.5, t, 1); // Strong rhythmic pulse
      this.pulseLfo.frequency.setTargetAtTime(1, t, 1); // 60 bpm (1Hz) slower pulse
      
    } else {
      // Days 21-30 (Суверенитет): Epic, clean, golden, emerging to light
      this.drone1.type = 'sine';
      this.drone1.frequency.setTargetAtTime(130.81, t, 1); // C3
      
      this.drone2.type = 'triangle';
      this.drone2.frequency.setTargetAtTime(196.00, t, 1); // G3 (Perfect 5th)
      
      this.filter.type = 'lowpass';
      this.filter.frequency.setTargetAtTime(1200, t, 2); // Brighter, open
      this.filter.Q.setTargetAtTime(0.5, t, 1);
      
      this.pulseGain.gain.setTargetAtTime(0.3, t, 1); // Gentle majestic pulse
      this.pulseLfo.frequency.setTargetAtTime(0.5, t, 1); // Slow majestic
    }
  }

  stopAmbient() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);
      
      const d1 = this.drone1, d2 = this.drone2, lfo = this.pulseLfo;
      setTimeout(() => {
        try { d1?.stop(); d2?.stop(); lfo?.stop(); } catch(e) {}
      }, 2100);
    }
    this.isAmbientPlaying = false;
  }

  toggleAmbient(force?: boolean) {
    const shouldPlay = force !== undefined ? force : !this.isAmbientPlaying;
    if (shouldPlay && this.enabled) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
  }

  step() {
    // Random mechanical keyboard click
    const freq = 600 + Math.random() * 200;
    this.playNoise(0.02, 0.03);
    this.playBeep(freq, 'triangle', 0.05, 0.02);
  }

  hover() {
    this.playBeep(800 + Math.random() * 100, 'sine', 0.03, 0.01);
  }

  success() {
    if (!this.enabled) return;
    this.initCtx();
    const t = this.ctx!.currentTime;
    
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    
    // Minor 3rd ascension
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.setValueAtTime(523.25, t + 0.1);
    osc.frequency.setValueAtTime(659.25, t + 0.2);
    
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    
    osc.connect(gain).connect(this.masterGain!);
    osc.start();
    osc.stop(t + 0.8);
  }

  glitch() {
    if (!this.enabled) return;
    this.playNoise(0.1, 0.1);
    this.playBeep(150 + Math.random() * 1000, 'sawtooth', 0.1, 0.05);
    setTimeout(() => {
      this.playNoise(0.05, 0.15);
      this.playBeep(150 + Math.random() * 1000, 'square', 0.05, 0.05);
    }, 100);
  }

  engineRev() { this.glitch(); /* Map to glitch for now */ }
  carZoom() { this.boot(); /* Map to boot for now */ }
  welcome() { this.playBeep(300, 'sine', 1, 0.1); }
  achievement() { this.success(); }

  toggleAudio() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
    return this.enabled;
  }
}

export const sounds = new SynthSpace();
