// Processamento de Áudio
class AudioProcessor {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.mediaStream = null;
    this.frequencyData = new Uint8Array();
    this.waveformData = new Uint8Array();
    this.isPlaying = false;
  }

  async startMicrophone() {
    console.log("Iniciando captura do microfone... (AudioProcessor)");
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log("Acesso ao microfone autorizado. Stream:", stream);
        resolve(stream);
      } catch (err) {
        console.error("Erro ao iniciar o microfone:", err);
        reject(err);
      }
    });
  }

  async loadAudioFile(file) {
    // TODO: carregar ficheiro de áudio
    console.log("Carregando ficheiro de áudio...");
    return new Promise(async (resolve, reject) => {
      try {
        const audio = await file;
        this.audioContext = audioContext.createMediaElementSource(audio);
        console.log(
          "Ficheiro carregado com sucesso. Contexo de áudio:",
          this.audioContext
        );
        resolve(this.audioContext);
      } catch (err) {
        console.error("Erro ao carregar ficheiro:", err);
        reject(err);
      }
    });
  }

  stop() {
    // TODO: parar processamento de áudio
    console.log("Parando processamento de áudio...");
  }

  update() {
    // TODO: atualizar dados de áudio
  }

  getFrequencyData() {
    // TODO: obter dados de frequência
    return this.frequencyData;
  }

  getWaveformData() {
    // TODO: obter dados de forma de onda
    return this.waveformData;
  }

  calculateAudioLevel() {
    // TODO: calcular nível de áudio
    return 0;
  }
}
