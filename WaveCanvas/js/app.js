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

  async startMicrophone() {
    console.log("A iniciar captura do microfone...");

    try {
      this.uiManager.updateAudioInfo("A iniciar microfone...");
      this.uiManager.setButtonStates(false);

      // parar/limpar quaisquer fontes existentes antes de iniciar (opcional)
      this.audioProcessor.stop();

      const src = await this.audioProcessor.startMicrophone();
      this.audioProcessor.mediaStream = this.audioProcessor.mediaStream;
      console.log("Microfone iniciado com sucesso!", src);

      const spectrumViz =
        this.visualizationEngine.visualizations.get("spectrum");
      if (spectrumViz) spectrumViz.audioProcessor = this.audioProcessor;

      const waveformViz =
        this.visualizationEngine.visualizations.get("waveform");
      if (waveformViz) waveformViz.audioProcessor = this.audioProcessor;

      const particlesViz =
        this.visualizationEngine.visualizations.get("particles");
      if (particlesViz) particlesViz.audioProcessor = this.audioProcessor;

      const circularViz =
        this.visualizationEngine.visualizations.get("circular");
      if (circularViz) circularViz.audioProcessor = this.audioProcessor;

      const oscilloscopeViz =
        this.visualizationEngine.visualizations.get("oscilloscope");
      if (oscilloscopeViz) oscilloscopeViz.audioProcessor = this.audioProcessor;

      this.visualizationEngine.start();

      this.uiManager.setButtonStates(true);
      this.uiManager.updateAudioInfo("Microfone ativo!");
      this.uiManager.updatePropertiesPanel();
      this.uiManager.setupAudioLevels();
    } catch (err) {
      console.error("Falha ao iniciar microfone:", err);
      this.uiManager.showError(`Erro ao iniciar microfone: ${err.message}`);
      this.uiManager.setButtonStates(false);
    }
  }

  async loadAudioFile(file) {
    console.log("A carregar ficheiro de áudio...");
    try {
      this.uiManager.updateAudioInfo("A carregar ficheiro...");
      this.uiManager.setButtonStates(false);
      // tentar parar fontes existentes
      this.audioProcessor.stop();
      const src = await this.audioProcessor.loadAudioFile(file);
      this.audioProcessor.mediaStream = null; // mediaStream só para microfone
      console.log("Ficheiro carregado com sucesso!", src);

      const spectrumViz =
        this.visualizationEngine.visualizations.get("spectrum");
      if (spectrumViz) spectrumViz.audioProcessor = this.audioProcessor;

      const waveformViz =
        this.visualizationEngine.visualizations.get("waveform");
      if (waveformViz) waveformViz.audioProcessor = this.audioProcessor;

      const particlesViz =
        this.visualizationEngine.visualizations.get("particles");
      if (particlesViz) particlesViz.audioProcessor = this.audioProcessor;

      const circularViz =
        this.visualizationEngine.visualizations.get("circular");
      if (circularViz) circularViz.audioProcessor = this.audioProcessor;

      const oscilloscopeViz =
        this.visualizationEngine.visualizations.get("oscilloscope");
      if (oscilloscopeViz) oscilloscopeViz.audioProcessor = this.audioProcessor;

      this.visualizationEngine.start();

      this.uiManager.setButtonStates(true);
      this.uiManager.updateAudioInfo("Ficheiro a tocar");
      this.uiManager.updatePropertiesPanel();
      this.uiManager.setupAudioLevels();
    } catch (err) {
      console.error(err);
      this.uiManager.showError(err.message || String(err));
      this.uiManager.setButtonStates(false);
    }
  }

  stopAudio() {
    this.visualizationEngine.stop();
    this.audioProcessor.stop();
    console.log("A parar áudio...");
  }

  setVisualization(type) {
    this.visualizationEngine.currentVisualization = type;
    console.log(`A definir visualização: ${type}`);
  }

  destroy() {
    // Limpar recursos
    console.log("A destruir aplicação...");

    // Parar visualização
    if (this.visualizationEngine) {
      this.visualizationEngine.stop();
    }

    // Parar processamento de áudio
    if (this.audioProcessor) {
      this.audioProcessor.stop();
    }

    // Limpar referências
    this.visualizationEngine = null;
    this.audioProcessor = null;
    this.uiManager = null;
    this.exportManager = null;
  }
}

// Inicialização da aplicação quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("audioCanvas");
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }

  // Função para ajustar a resolução do canvas para ecrãs HiDPI/Retina
  function setupCanvas(canvasElement) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvasElement.getBoundingClientRect();

    canvasElement.width = rect.width * dpr;
    canvasElement.height = rect.height * dpr;

    const ctx = canvasElement.getContext("2d");
    ctx.scale(dpr, dpr);
  }

  // Configura o canvas inicialmente e adiciona um listener para redimensionamento
  setupCanvas(canvas);
  window.addEventListener("resize", () => setupCanvas(canvas));

  const app = new App();
  window.app = app;
});
