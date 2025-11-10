class WaveformVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Forma de Onda";
    // Inicializar propriedades específicas
  }

  draw() {
    this.clearCanvas();

    const data = this.audioProcessor
      ? this.audioProcessor.getWaveformData()
      : this.testData;

    if (!data || data.length === 0) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const step = width / (data.length - 1);

    this.ctx.beginPath();

    // Ponto inicial
    const startX = 0;
    const startY = (data[0] * height) / 2 + height / 2;
    this.ctx.moveTo(startX, startY);

    // Desenhar com o uso da interpolação quadrática entre pontos
    for (let i = 1; i < data.length; i++) {
      const x = i * step;
      const y = (data[i] * height) / 2 + height / 2;

      const prevX = (i - 1) * step;
      const prevY = (data[i - 1] * height) / 2 + height / 2;
      const cpX = (prevX + x) / 2;

      this.ctx.quadraticCurveTo(cpX, prevY, x, y);
    }

    this.ctx.strokeStyle = "#4cf054ff";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }
}
