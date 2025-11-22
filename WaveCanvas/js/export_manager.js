// Gestão de Exportação
class ExportManager {
  constructor(visualizationEngine) {
    this.visualizationEngine = visualizationEngine;
  }

  exportAsPNG() {
    // Exportar como PNG
    console.log("A exportar visualização como PNG...");

    try {
      const canvas = this.visualizationEngine.canvas;
      const link = document.createElement("a");
      link.download = `audio-visualization-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Erro ao exportar PNG:", error);
    }
  }

  exportAsJPEG(quality = 1) {
    // Exportar como JPEG
    console.log(
      `A exportar visualização como JPEG com qualidade ${quality}...`
    );

    try {
      const canvas = this.visualizationEngine.canvas;
      const link = document.createElement("a");
      link.download = `audio-visualization-${new Date().getTime()}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", quality);
      link.click();
    } catch (error) {
      console.error("Erro ao exportar JPEG:", error);
    }
  }
}
