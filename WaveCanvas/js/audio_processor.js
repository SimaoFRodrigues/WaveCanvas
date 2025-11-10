class AudioProcessor {
  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.waveformData = new Uint8Array(this.analyser.fftSize);
    this.source = null;
    this.mediaStream = null;
  }

  async startMicrophone() {
    console.log("Iniciando captura do microfone... (AudioProcessor)");
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      console.log("Microfone conectado com sucesso!");
      return this.source;
    } catch (err) {
      console.error("Erro ao iniciar o microfone:", err);
      throw err;
    }
  }

  async loadAudioFile(file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const audioData = event.target.result;
        const audioBuffer = await this.audioContext.decodeAudioData(audioData);
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = audioBuffer;
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        return this.source;
      } catch (err) {}
    };
    reader.readAsArrayBuffer(file);
  }

  stop() {
    console.log("Parando processamento de áudio...");

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
    }

    if (this.source && this.source.stop) {
      this.source.stop();
    }

    if (this.audioContext) {
      this.audioContext.suspend();
    }
  }

  update() {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.frequencyData);
      this.analyser.getByteTimeDomainData(this.waveformData);
    }
  }

  getFrequencyData() {
    if (!this.analyser) return [];
    this.analyser.getByteFrequencyData(this.frequencyData);
    // Array Uint8Array com 1024 valores (0-255)
    // Cada valor representa a magnitude de uma frequência
    return this.frequencyData;
  }

  getWaveformData() {
    if (!this.analyser) return [];
    this.analyser.getByteTimeDomainData(this.waveformData);
    return Array.from(this.waveformData).map((value) => (value - 128) / 128);
  }

  calculateAudioLevel(peak, maxAmplitude = 1) {
    const amplitude = Math.max(peak / maxAmplitude, 1e-10);
    return 20 * Math.log10(amplitude);
  }
}
