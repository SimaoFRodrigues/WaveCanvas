class WaveformVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Forma de Onda";

    // Inicializar propriedades específicas
    this.properties = {
      lineWidth: 2,
      lineColor: "#4cf054ff",
      showGrid: false,
      smoothing: true,
      primaryColor: "#4cf054",
      backgroundColor: "#000000",
      audioSensitivity: 1.0,
    };
  }

  draw() {
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
      ? this.audioProcessor.getWaveformData()
      : this.testData;

    if (!data || data.length === 0) return;

    const sensitivity = this.properties.audioSensitivity || 1.0;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const step = width / (data.length - 1);

    this.ctx.beginPath();

    // Ponto inicial
    const startX = 0;
    const startY = (data[0] * height * sensitivity) / 2 + height / 2;
    this.ctx.moveTo(startX, startY);

    // Desenhar com o uso da interpolação quadrática entre pontos
    for (let i = 1; i < data.length; i++) {
      const x = i * step;
      const y = (data[i] * height * sensitivity) / 2 + height / 2;

      const prevX = (i - 1) * step;
      const prevY = (data[i - 1] * height * sensitivity) / 2 + height / 2;
      const cpX = (prevX + x) / 2;

      if (this.properties.smoothing) {
        this.ctx.quadraticCurveTo(cpX, prevY, x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.strokeStyle =
      this.properties.primaryColor || this.properties.lineColor;
    this.ctx.lineWidth = this.properties.lineWidth;
    this.ctx.stroke();
  }

  getProperties() {
    // Obter propriedades específicas
    const props = super.getProperties();
    props.lineWidth = this.properties.lineWidth;
    props.lineColor = this.properties.lineColor;
    props.showGrid = this.properties.showGrid;
    props.smoothing = this.properties.smoothing;
    props.primaryColor = this.properties.primaryColor;
    props.backgroundColor = this.properties.backgroundColor;
    props.audioSensitivity = this.properties.audioSensitivity;
    return props;
  }
}
