// Gestão de UI
class UIManager {
  constructor(app) {
    this.app = app;
    this.visualizationEngine = app.visualizationEngine;
    this.audioProcessor = app.audioProcessor;

    // Inicializar interface
    this.setupEventListeners();
  }

  updatePropertiesPanel() {
    // Atualizar painel de propriedades
    const container = document.getElementById("properties-container");
    if (!container) return;

    // Limpar container
    container.innerHTML = "";

    // Obter propriedades da visualização atual
    const properties = this.visualizationEngine.getVisualizationProperties();

    // Card de Cores
    const colorsCard = this.createCard("Cores");
    const colorsContent = this.createCardContent();

    // Cor Primária
    if (properties.primaryColor !== undefined) {
      const primaryControl = this.createColorControl(
        "Cor Primária",
        "primaryColor",
        properties.primaryColor
      );
      colorsContent.appendChild(primaryControl);
    }

    // Cor Secundária
    if (properties.secondaryColor !== undefined) {
      const secondaryControl = this.createColorControl(
        "Cor Secundária",
        "secondaryColor",
        properties.secondaryColor
      );
      colorsContent.appendChild(secondaryControl);
    }

    // Cor de Fundo
    if (properties.backgroundColor !== undefined) {
      const bgControl = this.createColorControl(
        "Cor de Fundo",
        "backgroundColor",
        properties.backgroundColor
      );
      colorsContent.appendChild(bgControl);
    }

    // Cor das Conexões (apenas para partículas)
    if (properties.connectionColor !== undefined) {
      const connectionColorControl = this.createColorControl(
        "Cor das Conexões",
        "connectionColor",
        properties.connectionColor
      );
      colorsContent.appendChild(connectionColorControl);
    }

    // Modo de Cor
    if (properties.colorMode !== undefined) {
      const modeControl = this.createSelectControl(
        "Modo de Cor",
        "colorMode",
        properties.colorMode,
        [
          { value: "hue", label: "Matiz" },
          { value: "gradient", label: "Gradiente" },
          { value: "solid", label: "Sólido" },
        ]
      );
      colorsContent.appendChild(modeControl);
    }

    colorsCard.appendChild(colorsContent);
    container.appendChild(colorsCard);

    // Card Visual
    const visualCard = this.createCard("Visual");
    const visualContent = this.createCardContent();

    // Propriedades específicas por tipo de visualização
    if (properties.barWidth !== undefined) {
      const barWidthControl = this.createRangeControl(
        "Largura das Barras",
        "barWidth",
        properties.barWidth,
        1,
        10,
        1
      );
      visualContent.appendChild(barWidthControl);
    }

    if (properties.lineWidth !== undefined) {
      const lineWidthControl = this.createRangeControl(
        "Espessura da Linha",
        "lineWidth",
        properties.lineWidth,
        1,
        10,
        1
      );
      visualContent.appendChild(lineWidthControl);
    }

    if (properties.particleCount !== undefined) {
      const particleCountControl = this.createRangeControl(
        "Número de Partículas",
        "particleCount",
        properties.particleCount,
        10,
        200,
        10
      );
      // Adicionar listener para reinicializar partículas quando mudar
      const rangeInput = particleCountControl.querySelector(
        "input[type='range']"
      );
      if (rangeInput) {
        rangeInput.addEventListener("change", () => {
          const viz = this.visualizationEngine.visualizations.get(
            this.visualizationEngine.currentVisualization
          );
          if (viz && viz.initParticles) {
            viz.initParticles();
          }
        });
      }
      visualContent.appendChild(particleCountControl);
    }

    if (properties.particleSize !== undefined) {
      const particleSizeControl = this.createRangeControl(
        "Tamanho das Partículas",
        "particleSize",
        properties.particleSize,
        1,
        10,
        1
      );
      visualContent.appendChild(particleSizeControl);
    }

    if (properties.showConnections !== undefined) {
      const connectionsControl = this.createToggleControl(
        "Mostrar Conexões",
        "showConnections",
        properties.showConnections
      );
      visualContent.appendChild(connectionsControl);
    }

    if (properties.connectionDistance !== undefined) {
      const distanceControl = this.createRangeControl(
        "Distância de Conexão",
        "connectionDistance",
        properties.connectionDistance,
        50,
        200,
        10
      );
      visualContent.appendChild(distanceControl);
    }

    if (properties.rotationSpeed !== undefined) {
      const rotationControl = this.createRangeControl(
        "Velocidade de Rotação",
        "rotationSpeed",
        properties.rotationSpeed,
        0,
        5,
        0.1
      );
      visualContent.appendChild(rotationControl);
    }

    if (properties.barCount !== undefined) {
      const barCountControl = this.createRangeControl(
        "Número de Barras",
        "barCount",
        properties.barCount,
        16,
        128,
        8
      );
      visualContent.appendChild(barCountControl);
    }

    if (properties.showTrail !== undefined) {
      const trailControl = this.createToggleControl(
        "Mostrar Trilha",
        "showTrail",
        properties.showTrail
      );
      visualContent.appendChild(trailControl);
    }

    if (properties.gridIntensity !== undefined) {
      const gridIntensityControl = this.createRangeControl(
        "Intensidade da Grelha",
        "gridIntensity",
        properties.gridIntensity,
        0.1,
        1.0,
        0.1
      );
      visualContent.appendChild(gridIntensityControl);
    }

    visualCard.appendChild(visualContent);
    container.appendChild(visualCard);

    // Card Áudio
    const audioCard = this.createCard("Áudio");
    const audioContent = this.createCardContent();

    if (properties.audioSensitivity !== undefined) {
      const sensitivityControl = this.createRangeControl(
        "Sensibilidade",
        "audioSensitivity",
        properties.audioSensitivity,
        0.1,
        3.0,
        0.1
      );
      audioContent.appendChild(sensitivityControl);
    }

    // Velocidade Máxima apenas para partículas
    if (properties.maxSpeed !== undefined) {
      const maxSpeedControl = this.createRangeControl(
        "Velocidade Máxima",
        "maxSpeed",
        properties.maxSpeed,
        1,
        10,
        0.5
      );
      audioContent.appendChild(maxSpeedControl);
    }

    audioCard.appendChild(audioContent);
    container.appendChild(audioCard);
  }

  createCard(title) {
    const card = document.createElement("div");
    card.className = "property-card";

    const cardTitle = document.createElement("h4");
    cardTitle.textContent = title;
    cardTitle.className = "property-card-title";
    card.appendChild(cardTitle);

    return card;
  }

  createCardContent() {
    const content = document.createElement("div");
    content.className = "property-card-content";
    return content;
  }

  createColorControl(label, property, value) {
    const control = document.createElement("div");
    control.className = "property-control";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    labelEl.htmlFor = `prop-${property}`;

    const input = document.createElement("input");
    input.type = "color";
    input.id = `prop-${property}`;
    input.value = value || "#4cf054";

    input.addEventListener("input", (e) => {
      this.visualizationEngine.updateVisualizationProperty(
        property,
        e.target.value
      );
    });

    control.appendChild(labelEl);
    control.appendChild(input);
    return control;
  }

  createToggleControl(label, property, value) {
    const control = document.createElement("div");
    control.className = "property-control";

    const labelEl = document.createElement("label");
    labelEl.htmlFor = `prop-${property}`;
    labelEl.style.display = "flex";
    labelEl.style.alignItems = "center";
    labelEl.style.gap = "10px";
    labelEl.style.cursor = "pointer";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `prop-${property}`;
    input.checked = value;
    input.style.width = "20px";
    input.style.height = "20px";
    input.style.cursor = "pointer";

    const labelText = document.createElement("span");
    labelText.textContent = label;

    input.addEventListener("change", (e) => {
      this.visualizationEngine.updateVisualizationProperty(
        property,
        e.target.checked
      );
    });

    labelEl.appendChild(input);
    labelEl.appendChild(labelText);
    control.appendChild(labelEl);
    return control;
  }

  createRangeControl(label, property, value, min, max, step) {
    const control = document.createElement("div");
    control.className = "property-control";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    labelEl.htmlFor = `prop-${property}`;

    const input = document.createElement("input");
    input.type = "range";
    input.id = `prop-${property}`;
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;

    const valueDisplay = document.createElement("span");
    valueDisplay.className = "range-value";
    valueDisplay.textContent = value;

    input.addEventListener("input", (e) => {
      const newValue = parseFloat(e.target.value);
      valueDisplay.textContent = newValue;
      this.visualizationEngine.updateVisualizationProperty(property, newValue);
    });

    const rangeWrapper = document.createElement("div");
    rangeWrapper.className = "range-wrapper";
    rangeWrapper.appendChild(input);
    rangeWrapper.appendChild(valueDisplay);

    control.appendChild(labelEl);
    control.appendChild(rangeWrapper);
    return control;
  }

  createSelectControl(label, property, value, options) {
    const control = document.createElement("div");
    control.className = "property-control";

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    labelEl.htmlFor = `prop-${property}`;

    const select = document.createElement("select");
    select.id = `prop-${property}`;

    for (let i = 0; i < options.length; i++) {
      const option = document.createElement("option");
      option.value = options[i].value;
      option.textContent = options[i].label;
      if (options[i].value === value) {
        option.selected = true;
      }
      select.appendChild(option);
    }

    select.addEventListener("change", (e) => {
      this.visualizationEngine.updateVisualizationProperty(
        property,
        e.target.value
      );
    });

    control.appendChild(labelEl);
    control.appendChild(select);
    return control;
  }

  updateAudioInfo(info, isError = false) {
    // Atualizar informações de áudio
    const audioStatus = document.getElementById("audioStatus");
    const audioLevel = document.getElementById("audioLevel");

    if (!audioStatus || !audioLevel) return;

    if (isError) {
      audioStatus.textContent = `Erro: ${info}`;
      audioStatus.style.color = "#f72585";
      audioLevel.textContent = "Nível: 0%";
    } else {
      // Se info é uma string simples
      if (typeof info === "string") {
        audioStatus.textContent = `Áudio: ${info}`;
        audioStatus.style.color = "#e6e6e6";
      } else {
        // Se info é um objeto
        audioStatus.textContent = `Áudio: ${info.status || "Ativo"}`;
        audioStatus.style.color = "#e6e6e6";
        audioLevel.textContent = `Nível: ${info.level || 0}%`;
      }
    }
  }

  setButtonStates(playing) {
    // Atualizar estados dos botões
    const startMicBtn = document.getElementById("startMic");
    const stopAudioBtn = document.getElementById("stopAudio");

    if (startMicBtn) startMicBtn.disabled = playing;
    if (stopAudioBtn) stopAudioBtn.disabled = !playing;
  }

  showError(message) {
    // Mostrar mensagem de erro
    const errorModal = document.getElementById("errorModal");
    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = message;
    errorModal.classList.remove("hidden");

    // Fechar modal ao clicar no X
    document.querySelector(".close").onclick = () => {
      errorModal.classList.add("hidden");
    };

    // Fechar modal ao clicar fora
    window.onclick = (event) => {
      if (event.target === errorModal) {
        errorModal.classList.add("hidden");
      }
    };
  }

  setupEventListeners() {
    //desabilita os botões
    document.getElementById("startMic").addEventListener("click", () => {
      $("#startMic").prop("disabled", true);
      $("#stopAudio").prop("disabled", false);
      this.app.startMicrophone();
    });

    document.getElementById("stopAudio").addEventListener("click", () => {
      $("#startMic").prop("disabled", false);
      $("#stopAudio").prop("disabled", true);
      this.app.stopAudio();
    });

    //o input file muda
    document.getElementById("audioFile").addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.app.loadAudioFile(e.target.files[0]);
      }
    });

    document
      .getElementById("visualizationType")
      .addEventListener("change", (e) => {
        this.app.setVisualization(e.target.value);
        // Atualizar painel de propriedades quando mudar visualização
        this.updatePropertiesPanel();
      });

    document.getElementById("exportPNG").addEventListener("click", () => {
      this.app.exportManager.exportAsPNG();
    });

    document.getElementById("exportJPEG").addEventListener("click", () => {
      this.app.exportManager.exportAsJPEG(0.9);
    });
  }

  setupAudioLevels() {
    // Configurar monitorização de níveis de áudio
    const updateLevel = () => {
      if (this.audioProcessor && this.audioProcessor.analyser) {
        const data = this.audioProcessor.getFrequencyData();
        if (data && data.length > 0) {
          // Calcular nível médio
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            sum += data[i];
          }
          const average = sum / data.length;
          const level = Math.round((average / 255) * 100);

          // Atualizar UI
          const audioLevel = document.getElementById("audioLevel");
          if (audioLevel) {
            audioLevel.textContent = `Nível: ${level}%`;
          }
        }
      }

      // Continuar monitorização
      if (this.app.visualizationEngine.isRunning) {
        requestAnimationFrame(updateLevel);
      }
    };

    // Iniciar monitorização
    updateLevel();
  }

  createPropertyControl(property, value, min, max, step) {
    // Criar controlo de propriedade
    const container = document.createElement("div");
    container.className = "property-control";

    const label = document.createElement("label");
    label.textContent = property;
    label.htmlFor = `prop-${property}`;

    const input = document.createElement("input");
    input.type = "range";
    input.id = `prop-${property}`;
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;

    input.addEventListener("input", (e) => {
      this.visualizationEngine.updateVisualizationProperty(
        property,
        parseFloat(e.target.value)
      );
    });

    container.appendChild(label);
    container.appendChild(input);

    return container;
  }
}
