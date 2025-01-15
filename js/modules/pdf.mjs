export default class PDFGenerator {
  /**
   * @param {HTMLElement} content
   * @param {NodeListOf<Element> | Element[]} elementsToNotDisplay
   * @param {string} [format="WEBP"]
   * @param {string} [title=document.title]
   */
  static async generatePDF(content, elementsToNotDisplay, format = "WEBP", title = document.title) {
    // Init
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Hide elements
    elementsToNotDisplay.forEach(el => el.style.display = "none");

    // Save original styles
    const originalStyles = {
      backgroundColor: content.style.backgroundColor,
      backgroundImage: content.style.backgroundImage,
      boxShadow: content.style.boxShadow
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
    elementsToNotDisplay.forEach(el => el.style.display = "");
  }
}