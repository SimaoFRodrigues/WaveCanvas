// Visualização Circular: Espetro radial com rotação
class CircularVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Espetro Circular";
    this.rotation = 0;
    // Inicializar propriedades específicas
    this.properties = {
      showGrid: false,
      primaryColor: "#4cf054",
      secondaryColor: "#4cc0f0",
      backgroundColor: "#000000",
      audioSensitivity: 1.0,
      rotationSpeed: 0.5,
      barCount: 64,
    };
  }

  draw() {
    // Desenhar espetro circular
    this.clearCanvas();

    // Desenhar fundo se necessário
    if (this.properties.backgroundColor) {
      this.ctx.fillStyle = this.properties.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Desenhar grelha
    if (this.properties.showGrid) {
      this.drawGrid();
    }

    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;

    if (!data || data.length === 0) return;

    const sensitivity = this.properties.audioSensitivity || 1.0;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const barCount = this.properties.barCount || 64;
    const angleStep = (Math.PI * 2) / barCount;

    // Atualizar rotação
    this.rotation += (this.properties.rotationSpeed || 0.5) * 0.01;

    // Desenhar barras radiais
    for (let i = 0; i < barCount; i++) {
      const angle = i * angleStep + this.rotation;
      const dataIndex = Math.floor((i / barCount) * data.length);
      const intensity = (data[dataIndex] / 255) * sensitivity;
      const barLength = radius * intensity;

      const x1 = centerX + Math.cos(angle) * (radius * 0.3);
      const y1 = centerY + Math.sin(angle) * (radius * 0.3);
      const x2 = centerX + Math.cos(angle) * (radius * 0.3 + barLength);
      const y2 = centerY + Math.sin(angle) * (radius * 0.3 + barLength);

      // Criar gradiente radial para cada barra
      const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, this.properties.primaryColor || "#4cf054");
      gradient.addColorStop(1, this.properties.secondaryColor || "#4cc0f0");

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 3;
      this.ctx.stroke();

      // Desenhar ponto no final da barra
      this.ctx.beginPath();
      this.ctx.arc(x2, y2, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = this.properties.primaryColor || "#4cf054";
      this.ctx.fill();
    }

    // Desenhar círculo central
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius * 0.25, 0, Math.PI * 2);
    this.ctx.fillStyle = this.properties.backgroundColor || "#000000";
    this.ctx.fill();
    this.ctx.strokeStyle = this.properties.primaryColor || "#4cf054";
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  getProperties() {
    // Obter propriedades específicas
    const props = super.getProperties();
    props.showGrid = this.properties.showGrid;
    props.primaryColor = this.properties.primaryColor;
    props.secondaryColor = this.properties.secondaryColor;
    props.backgroundColor = this.properties.backgroundColor;
    props.audioSensitivity = this.properties.audioSensitivity;
    props.rotationSpeed = this.properties.rotationSpeed;
    props.barCount = this.properties.barCount;
    return props;
  }
}
