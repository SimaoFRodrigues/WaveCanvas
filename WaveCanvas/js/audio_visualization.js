// Classe Abstrata Base para Visualizações, classe pai
class AudioVisualization {
  constructor(canvas, audioProcessor) {
    if (this.constructor === AudioVisualization) {
      throw new Error(
        "AudioVisualization é uma classe abstrata e não pode ser instanciada diretamente."
      );
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.audioProcessor = audioProcessor;
    this.name = "Visualização";
    this.properties = {};
    this.testData = new Uint8Array(256);
    this.frameCount = 0;
  }

  draw() {
    throw new Error("O método draw() deve ser implementado pela subclasse."); //metodo abstrato
  }

  update() {
    this.frameCount++;

    // Atualizar dados do audioProcessor se disponível
    if (this.audioProcessor) {
      this.audioProcessor.update();
    }
  }

  resize(width, height) {
    // Redimensionar visualização
    this.canvas.width = width;
    this.canvas.height = height;
  }

  getProperties() {
    // Obter propriedades da visualização
    const props = {};
    for (const key in this.properties) {
      props[key] = this.properties[key];
    }
    props.name = this.name;
    props.frameCount = this.frameCount;
    return props;
  }

  updateProperty(property, value) {
    // Atualizar propriedade
    if (this.properties.hasOwnProperty(property)) {
      this.properties[property] = value;
    }
  }

  clearCanvas() {
    // Limpar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGrid() {
    // Desenhar grelha de fundo
    const width = this.canvas.width;
    const height = this.canvas.height;
    const gridSize = 50;

    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    this.ctx.lineWidth = 1;

    // Linhas verticais
    for (let x = 0; x <= width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }

    // Linhas horizontais
    for (let y = 0; y <= height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    // Linha central horizontal
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    this.ctx.beginPath();
    this.ctx.moveTo(0, height / 2);
    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();
  }

  createGradient(colorStops = null) {
    // Criar gradiente de cores
    const gradient = this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Se não foram fornecidas cores, usar padrão
    if (!colorStops) {
      colorStops = [
        { offset: 0, color: "rgba(76, 201, 240, 0.8)" },
        { offset: 0.5, color: "rgba(67, 233, 123, 0.8)" },
        { offset: 1, color: "rgba(250, 237, 39, 0.8)" },
      ];
    }

    // Adicionar stops de cor ao gradiente
    colorStops.forEach((stop) => {
      gradient.addColorStop(stop.offset, stop.color);
    });

    return gradient;
  }

  normalizeData(data, min = 0, max = 255) {
    // Normalizar dados de áudio para o intervalo [0, 1]
    if (!data || data.length === 0) return [];

    // Encontrar min e max manualmente
    let dataMin = data[0];
    let dataMax = data[0];
    for (let i = 1; i < data.length; i++) {
      if (data[i] < dataMin) dataMin = data[i];
      if (data[i] > dataMax) dataMax = data[i];
    }

    const range = dataMax - dataMin || 1; // Evitar divisão por zero

    const normalized = [];
    for (let i = 0; i < data.length; i++) {
      // Normalizar para [0, 1]
      const normalizedValue = (data[i] - dataMin) / range;
      normalized.push(normalizedValue);
    }

    return normalized;
  }
}
