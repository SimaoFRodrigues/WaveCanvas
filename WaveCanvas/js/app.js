// Classe principal da aplicação
class App {
  constructor() {
    this.audioProcessor = new AudioProcessor();
    this.visualizationEngine = new VisualizationEngine("audioCanvas");
    this.uiManager = new UIManager(this);
    this.exportManager = new ExportManager(this.visualizationEngine);

    // Inicialização
    this.init();
  }

  init() {
    console.log("App inicializada");
  }

  startMicrophone() {
    console.log("Iniciando captura do microfone...");

    try {
      this.uiManager.updateAudioInfo("A iniciar microfone...");
      this.uiManager.setButtonStates(false);

      this.stopAudio();

      if (this.audioProcessor.audioContext.state === "suspended") {
        this.audioProcessor.audioContext.resume();
      }

      this.audioProcessor.mediaStream = this.audioProcessor.startMicrophone();
      console.log(
        "Microfone iniciado com sucesso!",
        this.audioProcessor.mediaStream
      );

      const spectrumViz =
        this.visualizationEngine.visualizations.get("spectrum");
      if (spectrumViz) spectrumViz.audioProcessor = this.audioProcessor;

      const waveformViz =
        this.visualizationEngine.visualizations.get("waveform");
      if (waveformViz) waveformViz.audioProcessor = this.audioProcessor;

      const particlesViz =
        this.visualizationEngine.visualizations.get("particles");
      if (particlesViz) particlesViz.audioProcessor = this.audioProcessor;

      this.visualizationEngine.start();

      this.uiManager.setButtonStates(true);
      this.uiManager.updateAudioInfo("Microfone ativo!");
    } catch (err) {
      console.error("Falha ao iniciar microfone:", err);
      this.uiManager.showError(`Erro ao iniciar microfone: ${err.message}`);
      this.uiManager.setButtonStates(false);
    }
  }

  loadAudioFile(file) {
    console.log("Carregando ficheiro de áudio...");
    try {
      this.uiManager.updateAudioInfo("A carregar ficheiro...");
      this.uiManager.setButtonStates(false);
      this.stopAudio();

      if (this.audioProcessor.audioContext.state === "suspended") {
        this.audioProcessor.audioContext.resume();
      }

      this.audioProcessor.mediaStream = this.audioProcessor.loadAudioFile(file);

      const spectrumViz =
        this.visualizationEngine.visualizations.get("spectrum");
      if (spectrumViz) spectrumViz.audioProcessor = this.audioProcessor;

      const waveformViz =
        this.visualizationEngine.visualizations.get("waveform");
      if (waveformViz) waveformViz.audioProcessor = this.audioProcessor;

      const particlesViz =
        this.visualizationEngine.visualizations.get("particles");
      if (particlesViz) particlesViz.audioProcessor = this.audioProcessor;

      if (this.audioProcessor.mediaStream == null) {
        this.uiManager.showError(
          "Insucesso no carregamento do ficheiro de áudio."
        );
      }

      //Dar start ao visualizer

      console.log(
        "Ficheiro carregado com sucesso!",
        this.audioProcessor.mediaStream
      );
    } catch (error) {
      this.uiManager.showError(err);
    }
  }

  stopAudio() {
    this.visualizationEngine.stop();
    if (this.audioProcessor.audioContext.state === "running") {
      this.audioProcessor.audioContext.suspend();
    }
    console.log("Parando áudio...");
  }

  setVisualization(type) {
    this.visualizationEngine.currentVisualization = type;
    console.log(`Definindo visualização: ${type}`);
  }

  exportFrame() {
    // TODO: exportar frame atual
    console.log("Exportando frame...");
  }

  destroy() {
    // TODO: limpar recursos
    console.log("Destruindo aplicação...");
  }
}

// Inicialização da aplicação quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();

  // Expor app globalmente para debugging (remover em produção)
  window.app = app;
});
