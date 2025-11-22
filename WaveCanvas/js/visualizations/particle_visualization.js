class ParticleVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Partículas";
    this.particles = [];
    this.lastTime = 0;

    // Inicializar propriedades específicas
    this.properties = {
      particleCount: 50,
      maxSpeed: 2,
      showGrid: false,
      connectionDistance: 100,
      showConnections: true,
      particleSize: 3,
      primaryColor: "#4cf054",
      backgroundColor: "#000000",
      connectionColor: "#4cc0f0",
      audioSensitivity: 1.0,
    };

    // Inicializar partículas
    this.initParticles();
  }

  draw() {
    // Desenhar partículas
    this.clearCanvas();

    // Desenhar fundo
    if (this.properties.backgroundColor) {
      this.ctx.fillStyle = this.properties.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Desenhar grelha
    if (this.properties.showGrid) {
      this.drawGrid();
    }

    this.drawParticles();
    this.drawConnections();
  }

  update() {
    // Atualizar partículas
    super.update();
    this.updateParticles();
  }

  getProperties() {
    // Obter propriedades específicas
    const props = super.getProperties();
    props.particleCount = this.properties.particleCount;
    props.maxSpeed = this.properties.maxSpeed;
    props.connectionDistance = this.properties.connectionDistance;
    props.showConnections = this.properties.showConnections;
    props.showGrid = this.properties.showGrid;
    props.particleSize = this.properties.particleSize;
    props.primaryColor = this.properties.primaryColor;
    props.backgroundColor = this.properties.backgroundColor;
    props.connectionColor = this.properties.connectionColor;
    props.audioSensitivity = this.properties.audioSensitivity;
    return props;
  }

  updateProperty(property, value) {
    // Atualizar propriedade
    if (this.properties.hasOwnProperty(property)) {
      this.properties[property] = value;

      // Se a cor primária mudou, atualizar cores das partículas
      if (property === "primaryColor") {
        for (let i = 0; i < this.particles.length; i++) {
          this.particles[i].color = value;
        }
      }
    } else {
      // Chamar método da classe base se não for propriedade específica
      super.updateProperty(property, value);
    }
  }

  initParticles() {
    // Inicializar partículas
    this.particles = [];
    const count = this.properties.particleCount || 50;
    const primaryColor = this.properties.primaryColor || "#4cf054";
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * (this.properties.particleSize || 3) + 1,
        color: primaryColor,
      });
    }
  }

  updateParticles() {
    // Atualizar estado das partículas
    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;
    const audioLevel = this.audioProcessor
      ? this.audioProcessor.calculateAudioLevel()
      : 0.5;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Mover partícula
      p.x += p.vx;
      p.y += p.vy;

      // Rebater nas bordas
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Aplicar influência do áudio
      if (data.length > 0) {
        const freqIndex = Math.floor((i / this.particles.length) * data.length);
        const intensity = data[freqIndex] / 255;

        p.vx += (Math.random() - 0.5) * intensity * 0.5;
        p.vy += (Math.random() - 0.5) * intensity * 0.5;

        // Limitar velocidade
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 2 + audioLevel * 3;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
      }
    }
  }

  drawParticles() {
    // Desenhar partículas
    const primaryColor = this.properties.primaryColor || "#4cf054";
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      // Usar cor primária das propriedades
      this.ctx.fillStyle = primaryColor;
      this.ctx.fill();
    }
  }

  drawConnections() {
    // Desenhar conexões entre partículas
    if (!this.properties.showConnections) return;

    const maxDistance = this.properties.connectionDistance || 100;
    const connectionColor = this.properties.connectionColor || "#4cc0f0";

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);

          // Converter cor hex para rgba com opacidade
          const hex = connectionColor.replace("#", "");
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }
}
