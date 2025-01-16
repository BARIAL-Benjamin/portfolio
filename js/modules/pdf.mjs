export default class PDF {
  /** Traite, génère et sauvegarde un PDF
   * @param {Event} self Bouton
   * @param {HTMLElement} content Elément à capturer
   * @param {NodeListOf<Element> | Element[]} [elementsToNotDisplay = null] Eléments à ne pas afficher
   * @param {string} [format="PNG"] Format de compression (default: PNG)
   * @param {string} [title=document.title] Titre de sortie du PDF (default: titre de la page)
   */
  static async generatePDF(
    self,
    content,
    elementsToNotDisplay = null,
    format = "PNG",
    title = document.title
  ) {
    // Init
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Hide elements
    if (elementsToNotDisplay) elementsToNotDisplay.forEach((el) => (el.style.display = "none"));
    self.target.style.display = "none";

    // Save original styles
    const originalStyles = {
      backgroundColor: content.style.backgroundColor,
      backgroundImage: content.style.backgroundImage,
      boxShadow: content.style.boxShadow,
    };

    // Remove styles for PDF generation
    content.style.backgroundColor = "none";
    content.style.backgroundImage = "none";
    content.style.boxShadow = "none";

    // Generate canvas and add to PDF
    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL(content, `image/${format.toLowerCase()}`);
    pdf.addImage(imgData, format, 0, 0);

    // Save PDF
    pdf.save(`${title}.pdf`);

    // Restore original styles
    Object.assign(content.style, originalStyles);
    if (elementsToNotDisplay) elementsToNotDisplay.forEach((el) => (el.style.display = ""));
    self.target.style.display = "";
  }

  /** Créer le bouton pour créer le PDF associé au contenu
   * @param {HTMLElement | Element} beforeWhere Elément auquel le bouton ce placera avant 
   * @param {HTMLElement | Element} content Elément à capturer
   * @param {NodeListOf<Element> | Element[]} [elementsToNotDisplay=null] Eléments à ne pas afficher
   * @param {string} [format="PNG"] Format de compression (default: PNG)
   * @param {string} [title=document.title] Titre de sortie du PDF (default: titre de la page)
   */
  static async createButtonPDF(
    beforeWhere,
    content,
    elementsToNotDisplay = null,
    format = "PNG",
    title = document.title
  ) {
    await import("../html2canvas.min.js");
    await import("../jspdf.umd.min.js");

    /** Titre sans les caractères spéciaux */
    const titre = title.replaceAll(/[^a-zA-Z0-9À-ÿ\ ]+/g, '-');    

    const button = document.createElement("button");
    button.textContent = "Télécharger en PDF";
    button.title = titre;
    button.type = "button";
    button.addEventListener(
      "click",
      async (e) => await PDF.generatePDF(e, content, elementsToNotDisplay, format, titre)
    );
    beforeWhere.insertAdjacentElement("beforebegin", button);
  }
}
