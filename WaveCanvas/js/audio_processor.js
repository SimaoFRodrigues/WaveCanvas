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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const dog = true;

        if (dog) resolve("Cão");
        else reject("Não Cão");
      }, 1500);
    });
  }

  async loadAudioFile(file) {
    // TODO: carregar ficheiro de áudio
    console.log("Carregando ficheiro de áudio...");
    // Devolver Promise
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
