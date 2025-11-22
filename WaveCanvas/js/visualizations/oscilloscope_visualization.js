// Modo Osciloscópio: Visualização técnica de waveform
class OscilloscopeVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Osciloscópio";
    this.trail = [];
    this.maxTrailLength = 50;
    // Inicializar propriedades específicas
    this.properties = {
      showGrid: true,
      primaryColor: "#4cf054",
      backgroundColor: "#000000",
      audioSensitivity: 1.0,
      lineWidth: 2,
      showTrail: true,
      gridIntensity: 0.3,
    };
  }

  draw() {
    // Desenhar visualização
    this.clearCanvas();

    // Desenhar fundo
    if (this.properties.backgroundColor) {
      this.ctx.fillStyle = this.properties.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Desenhar grelha
    if (this.properties.showGrid) {
      this.drawOscilloscopeGrid();
    }

    const data = this.audioProcessor
      ? this.audioProcessor.getWaveformData()
      : this.testData;

    if (!data || data.length === 0) return;

    const sensitivity = this.properties.audioSensitivity || 1.0;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerY = height / 2;
    const step = width / (data.length - 1);

    // Desenhar trilha
    if (this.properties.showTrail) {
      this.drawTrail();
    }

    // Desenhar linha principal
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.properties.primaryColor || "#4cf054";
    this.ctx.lineWidth = this.properties.lineWidth || 2;

    for (let i = 0; i < data.length; i++) {
      const x = i * step;
      const y = centerY + data[i] * (height / 2) * sensitivity;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.stroke();

    // Adicionar ao trail
    if (this.properties.showTrail) {
      const trailPoint = [];
      for (let i = 0; i < data.length; i++) {
        const x = i * step;
        const y = centerY + data[i] * (height / 2) * sensitivity;
        trailPoint.push({ x: x, y: y });
      }
      this.trail.push(trailPoint);
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }
    }
  }

  drawOscilloscopeGrid() {
    // Desenhar grelha
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerY = height / 2;
    const gridIntensity = this.properties.gridIntensity || 0.3;

    this.ctx.strokeStyle = `rgba(76, 201, 240, ${gridIntensity})`;
    this.ctx.lineWidth = 1;

    // Linhas horizontais
    const horizontalDivisions = 8;
    for (let i = 0; i <= horizontalDivisions; i++) {
      const y = (height / horizontalDivisions) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    // Linha central mais destacada
    this.ctx.strokeStyle = `rgba(76, 201, 240, ${gridIntensity * 2})`;
    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);
    this.ctx.lineTo(width, centerY);
    this.ctx.stroke();

    // Linhas verticais
    this.ctx.strokeStyle = `rgba(76, 201, 240, ${gridIntensity})`;
    const verticalDivisions = 10;
    for (let i = 0; i <= verticalDivisions; i++) {
      const x = (width / verticalDivisions) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }
  }

  drawTrail() {
    // Desenhar histórico de ondas
    if (this.trail.length === 0) return;

    for (let t = 0; t < this.trail.length; t++) {
      const trailPoint = this.trail[t];
      const opacity = (t / this.trail.length) * 0.3;

      this.ctx.beginPath();
      this.ctx.strokeStyle = `rgba(76, 201, 240, ${opacity})`;
      this.ctx.lineWidth = 1;

      for (let i = 0; i < trailPoint.length; i++) {
        const point = trailPoint[i];
        if (i === 0) {
          this.ctx.moveTo(point.x, point.y);
        } else {
          this.ctx.lineTo(point.x, point.y);
        }
      }

      this.ctx.stroke();
    }
  }

  getProperties() {
    // Obter propriedades específicas
    const props = super.getProperties();
    props.showGrid = this.properties.showGrid;
    props.primaryColor = this.properties.primaryColor;
    props.backgroundColor = this.properties.backgroundColor;
    props.audioSensitivity = this.properties.audioSensitivity;
    props.lineWidth = this.properties.lineWidth;
    props.showTrail = this.properties.showTrail;
    props.gridIntensity = this.properties.gridIntensity;
    return props;
  }
}
