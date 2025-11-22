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
    this.sourceType = null; // microphone, buffer ou null
  }

  stopCurrentSource() {
    // limpa e para a fonte atual
    if (this.sourceType === "buffer" && this.source) {
      try {
        // tentar parar a buffer source
        if (this.source.stop) {
          this.source.stop();
        }
      } catch (e) {}
      try {
        this.source.disconnect();
      } catch (e) {}
      this.source = null;
      this.sourceType = null;
    }

    if (this.sourceType === "microphone" && this.mediaStream) {
      try {
        const tracks = this.mediaStream.getTracks();
        for (let i = 0; i < tracks.length; i++) {
          tracks[i].stop();
        }
      } catch (e) {}
      try {
        if (this.source) this.source.disconnect();
      } catch (e) {}
      this.mediaStream = null;
      this.source = null;
      this.sourceType = null;
    }
  }

  async startMicrophone() {
    console.log("A iniciar captura do microfone... (AudioProcessor)");
    try {
      // bloqueia se já existir uma fonte ativa
      if (this.source) {
        throw new Error(
          "Existe uma fonte ativa, pare-a antes de iniciar o microfone."
        );
      }

      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceType = "microphone";
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
    try {
      // Não permite carregar outro ficheiro se já existir uma fonte ativa
      if (this.source) {
        throw new Error(
          "Existe uma fonte ativa, aguarde o fim ou pare-a antes de carregar outro ficheiro."
        );
      }
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      var reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          var audioData = evt.target.result;
          const audioBuffer = await this.audioContext.decodeAudioData(
            audioData
          );

          const bufferSource = this.audioContext.createBufferSource();
          bufferSource.buffer = audioBuffer;
          bufferSource.connect(this.analyser);
          this.analyser.connect(this.audioContext.destination);
          bufferSource.onended = () => {
            if (this.source === bufferSource) {
              this.source = null;
              this.sourceType = null;
            }
          };
          this.source = bufferSource;
          this.sourceType = "buffer";
          bufferSource.start(0);
        } catch (err) {
          console.error("Erro ao decodificar o ficheiro de áudio:", err);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Erro ao carregar ficheiro de áudio:", err);
      throw err;
    }
  }

  stop() {
    console.log("A parar processamento de áudio...");

    // garantir limpeza correcta
    this.stopCurrentSource();

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
