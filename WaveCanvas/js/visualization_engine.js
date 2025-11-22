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
    // Inicializar tipos de visualização
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
    this.visualizations.set(
      "circular",
      new CircularVisualization(this.canvas, null)
    );
    this.visualizations.set(
      "oscilloscope",
      new OscilloscopeVisualization(this.canvas, null)
    );

    // Não definir visualização padrão
    this.currentVisualization = null;
  }

  setVisualization(type) {
    this.currentVisualization = type;
    console.log(`A definir visualização: ${type}`);
    return false;
  }

  start() {
    console.log("A iniciar motor de visualização...");
    this.isRunning = true;

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  stop() {
    if (this.isRunning) {
      console.log("A parar motor de visualização...");
      this.isRunning = false;
      cancelAnimationFrame(this.animationId);
    }
  }

  resize(width, height) {
    // Redimensionar canvas
    if (width && height) {
      this.canvas.width = width;
      this.canvas.height = height;

      // Redimensionar todas as visualizações
      this.visualizations.forEach((viz) => {
        viz.resize(width, height);
      });
    } else {
      // Usar tamanho do container
      const container = this.canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        // Redimensionar todas as visualizações
        this.visualizations.forEach((viz) => {
          viz.resize(rect.width, rect.height);
        });
      }
    }
  }

  getVisualizationProperties() {
    // Obter propriedades da visualização atual
    const viz = this.visualizations.get(this.currentVisualization);
    if (viz) {
      return viz.getProperties();
    }
    return {};
  }

  updateVisualizationProperty(property, value) {
    // Atualizar propriedade da visualização
    const viz = this.visualizations.get(this.currentVisualization);
    if (viz) {
      viz.updateProperty(property, value);
      console.log(`A atualizar propriedade: ${property} = ${value}`);
    }
  }

  animate() {
    if (!this.isRunning) return;

    const viz = this.visualizations.get(this.currentVisualization);
    if (viz && this.currentVisualization) {
      viz.update();
      viz.draw();
    } else {
      // Se não há visualização selecionada, limpar canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
