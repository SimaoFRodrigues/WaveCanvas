// Motor de Visualização
class VisualizationEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.visualizations = new Map();
    this.currentVisualization = null;
    this.animationId = null;
    this.isRunning = false;

    // Inicializar visualizações
    this.initVisualizations();
  }

  initVisualizations() {
    // TODO: inicializar tipos de visualização
    this.visualizations.set(
      "spectrum",
      new SpectrumVisualization(this.canvas, null)
    );
    this.visualizations.set(
      "waveform",
      new WaveformVisualization(this.canvas, null)
    );
    this.visualizations.set(
      "particles",
      new ParticleVisualization(this.canvas, null)
    );
  }

  setVisualization(type) {
    this.currentVisualization = type;
    console.log(`Definindo visualização: ${type}`);
    return false;
  }

  start() {
    console.log("Iniciando motor de visualização...");
    this.isRunning = true;

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  stop() {
    if (this.isRunning) {
      console.log("Parando motor de visualização...");
      this.isRunning = false;
      cancelAnimationFrame(this.animationId);
    }
  }

  resize() {
    // TODO: redimensionar canvas
  }

  getVisualizationProperties() {
    // TODO: obter propriedades da visualização atual
    return {};
  }

  updateVisualizationProperty(property, value) {
    // TODO: atualizar propriedade da visualização
    console.log(`Atualizando propriedade: ${property} = ${value}`);
  }

  animate() {
    if (!this.isRunning) return;

    const viz = this.visualizations.get(this.currentVisualization);
    if (viz) {
      viz.update();
      viz.draw();
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
