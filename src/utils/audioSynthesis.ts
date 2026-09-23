/**
 * Clean Web Audio API sound synthesizer for soothing ambient audio.
 * Zero external audio files or network requests required.
 */
class AmbientAudioController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private noiseNode: AudioBufferSourceNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public async start(type: 'ambient' | 'ocean' | 'breeze' = 'ambient') {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    this.stop(); // Clear any running audio

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 1.5);
    this.masterGain.connect(this.ctx.destination);

    if (type === 'ambient') {
      // Harmonic 432Hz calming chord (A=432Hz, E=324Hz, C#=270Hz)
      const freqs = [108, 216, 270, 324];
      this.oscillators = freqs.map((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const oscGain = this.ctx!.createGain();
        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
        
        // Gentle slow LFO modulation
        const lfo = this.ctx!.createOscillator();
        const lfoGain = this.ctx!.createGain();
        lfo.frequency.setValueAtTime(0.1 + index * 0.05, this.ctx!.currentTime);
        lfoGain.gain.setValueAtTime(1.5, this.ctx!.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        oscGain.gain.setValueAtTime(0.06 / (index + 1), this.ctx!.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.masterGain!);
        osc.start();
        return osc;
      });
    } else {
      // Gentle filtered pink noise (simulating waves/rain)
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      // Periodic swell for gentle wave cadence
      const swellOsc = this.ctx.createOscillator();
      const swellGain = this.ctx.createGain();
      swellOsc.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 sec wave cycle
      swellGain.gain.setValueAtTime(140, this.ctx.currentTime);
      swellOsc.connect(this.filter.frequency);
      swellOsc.start();

      this.noiseNode.connect(this.filter);
      this.filter.connect(this.masterGain);
      this.noiseNode.start();
    }

    this.isRunning = true;
  }

  public stop() {
    if (!this.ctx || !this.isRunning) return;
    if (this.masterGain) {
      try {
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      } catch {
        // Safe fallback
      }
    }
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch {}
      });
      this.oscillators = [];
      if (this.noiseNode) {
        try { this.noiseNode.stop(); this.noiseNode.disconnect(); } catch {}
        this.noiseNode = null;
      }
      this.isRunning = false;
    }, 850);
  }

  public toggle(type: 'ambient' | 'ocean' | 'breeze' = 'ambient') {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start(type);
      return true;
    }
  }

  public getStatus() {
    return this.isRunning;
  }
}

export const ambientSound = new AmbientAudioController();
