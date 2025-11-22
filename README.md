# WaveCanvas - Visualizador de Áudio Interativo

## Autores e Data

- **Autores:** Simão Rodrigues e Rodrigo Resa
- **Data:** 16 de novembro de 2025

![<Sistema de Visualização de Áudio>](screenshot.png)

## Instruções de Instalação e Uso

### Instalação

Este projeto é uma aplicação web front-end que teve como objetivo desenvolver competências avançadas em programação JavaScript orientada a objetos e manipulação do elemento Canvas HTML5, com foco na criação de visualizações de áudio em tempo real.

**Clonar e abrir o projeto localmente**

1. Abre o Visual Studio Code.
2. Abre o terminal integrado.
3. No terminal, escreve o seguinte comando para clonar o repositório:
   `git clone https://github.com/teu-utilizador/WaveCanvas.git`

**Usar a extensão "Live Server" no Visual Studio Code**

1.  Instale a extensão _Live Server_ no VS Code.
2.  Abra a pasta do projeto no VS Code.
3.  Clique com o botão direito no ficheiro `index.html` e selecione "Open with Live Server".

### Uso

1.  **Selecionar Fonte de Áudio:**

    - **Microfone:** Clique no botão "Iniciar Microfone" para capturar áudio em tempo real. Terá de conceder permissão ao navegador para aceder ao microfone.
    - **Ficheiro de Áudio:** Clique no botão "Carregar Ficheiro" e selecione um ficheiro de áudio do seu computador (ex: MP3, WAV). A visualização começará automaticamente.

2.  **Escolher Visualização:**

    - Utilize os botões na barra de navegação para alternar entre os diferentes modos de visualização disponíveis (Espetro de Frequências, Forma de Onda, Partículas, Espetro Circular e Osciloscópio).

3.  **Personalizar Propriedades:**

    - O painel à abaixo do canva ("Propriedades da Visualização") permite ajustar dinamicamente os parâmetros da visualização ativa, como cores, espessura de linha, número de partículas, etc.

4.  **Exportar:**
    - Clique no botão "Exportar como PNG/JPG" para descarregar um screenshot da visualização atual no formato desejado.

## Funcionalidades Implementadas

- **Visualização de Áudio em Tempo Real:** Renderiza formas de onda e espectros de frequência de áudio numa tag `<canvas>`.
- **Múltiplas Fontes de Áudio:** Suporte para captura de áudio do microfone do utilizador ou através do carregamento de ficheiros de áudio locais.
- **Motor de Visualização Modular:** Permite adicionar facilmente novos tipos de visualização. As visualizações implementadas incluem:
  - **Espetro de Frequências:** Um espectrograma de barras clássico.
  - **Forma de Onda:** Desenho da forma de onda do áudio no domínio do tempo.
  - **Partículas:** Partículas que reagem à energia do áudio.
  - **Espetro Circular:** Visualização circular baseada nas frequências.
  - **Osciloscópio:** Simula um ecrã de osciloscópio.
- **Painel de Propriedades Dinâmico:** A interface de utilizador adapta-se para mostrar apenas os controlos relevantes para a visualização selecionada, permitindo a personalização de cores, formas e comportamentos.
- **Gestão de Estado:** A aplicação gere corretamente o estado da fonte de áudio, impedindo a sobreposição de múltiplas fontes (ex: carregar um ficheiro enquanto o microfone está ativo).
- **Exportação de Imagem:** Funcionalidade para guardar o estado atual do canvas como um ficheiro de imagem (`.png` ou `.jpg`).

## Arquitetura do Projeto

O projeto foi desenvolvido com uma arquitetura modular e orientada a objetos para facilitar a manutenção e extensibilidade. Os principais componentes são:

- **`app.js` (`App`):** A classe principal que atua como orquestrador. Inicializa e interliga todos os outros módulos (AudioProcessor, VisualizationEngine, UIManager).
- **`audio_processor.js` (`AudioProcessor`):** Encapsula toda a lógica da **Web Audio API**. É responsável por:
  - Obter o `AudioContext`.
  - Criar e gerir o `AnalyserNode`.
  - Iniciar a captura do microfone (`getUserMedia`).
  - Carregar e decodificar ficheiros de áudio.
  - Fornecer os dados de frequência (`frequencyData`) e forma de onda (`waveformData`) aos visualizadores.
- **`visualization_engine.js` (`VisualizationEngine`):** Gere o ciclo de renderização (`requestAnimationFrame`) no `<canvas>`. Mantém um registo das visualizações disponíveis e desenha a que está ativa no momento.
- **`ui_manager.js` (`UIManager`):** Responsável por toda a manipulação do DOM e interação com o utilizador. Configura os _event listeners_ para os botões, atualiza o painel de propriedades e exibe mensagens de estado ou erro.
- **`export_manager.js` (`ExportManager`):** Contém a lógica para exportar o conteúdo do canvas para um ficheiro de imagem.
- **Pasta `visualizations/`:** Contém as classes individuais para cada tipo de visualização. Cada classe implementa um método `draw()` que é chamado pelo `VisualizationEngine` a cada frame.

Esta separação de responsabilidades garante que a lógica de áudio, a lógica de renderização e a lógica de UI permaneçam desacopladas.
