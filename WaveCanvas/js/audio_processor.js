class AudioProcessor {
  constructor() {
    this.audioContext = new AudioContext();
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

      const source = this.audioContext.createMediaStreamSource(
        this.mediaStream
      );
      source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      this.source = source;
      console.log("Microfone conectado com sucesso!");
      return source;
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
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.source = source;
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
