// Visualizações Concretas
class SpectrumVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Espetro de Frequências";

    // Inicializar propriedades específicas
    this.properties = {
      barWidth: 2,
      showGrid: false,
      colorMode: "hue", // "hue", "gradient", "solid"
      primaryColor: "#4cf054",
      secondaryColor: "#4cc0f0",
      backgroundColor: "#000000",
      audioSensitivity: 1.0,
    };
  }

  draw() {
    // Desenhar espetro de frequências
    this.clearCanvas();

    // Desenhar fundo se necessário
    if (this.properties.backgroundColor) {
      this.ctx.fillStyle = this.properties.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Desenhar grelha se necessário
    if (this.properties.showGrid) {
      this.drawGrid();
    }

    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;
    const sensitivity = this.properties.audioSensitivity || 1.0;
    const barWidth =
      (this.properties.barWidth || 2) * (this.canvas.width / data.length);

    for (let i = 0; i < data.length; i++) {
      const intensity = (data[i] / 255) * sensitivity;
      const barHeight = intensity * this.canvas.height;
      const x = i * (this.canvas.width / data.length);
      const y = this.canvas.height - barHeight;

      // Aplicar modo de cor
      if (this.properties.colorMode === "solid") {
        this.ctx.fillStyle = this.properties.primaryColor || "#4cf054";
      } else if (this.properties.colorMode === "gradient") {
        const gradient = this.ctx.createLinearGradient(
          0,
          y,
          0,
          this.canvas.height
        );
        gradient.addColorStop(0, this.properties.primaryColor || "#4cf054");
        gradient.addColorStop(1, this.properties.secondaryColor || "#4cc0f0");
        this.ctx.fillStyle = gradient;
      } else {
        // Modo hue (padrão)
        this.ctx.fillStyle = `hsl(${(i / data.length) * 360}, 100%, 50%)`;
      }

      this.ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
  }

  getProperties() {
    // Obter propriedades específicas
    const props = super.getProperties();
    props.barWidth = this.properties.barWidth;
    props.showGrid = this.properties.showGrid;
    props.colorMode = this.properties.colorMode;
    props.primaryColor = this.properties.primaryColor;
    props.secondaryColor = this.properties.secondaryColor;
    props.backgroundColor = this.properties.backgroundColor;
    props.audioSensitivity = this.properties.audioSensitivity;
    return props;
  }
}
