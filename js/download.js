// /** Créer le bouton pour télécharger le PDF de la page
//  * @param {HTMLElement | Element} beforeWhere 
//  * @param {HTMLElement | Element} content
//  * @param {NodeListOf<Element> | Element[]} elementsToNotDisplay
//  */
// const createButtonPDF = async (beforeWhere, content, elementsToNotDisplay) => {
//     await import("./html2canvas.min.js");
//     await import("./jspdf.umd.min.js");
// 	const button = document.createElement("button");
// 	button.textContent = "Télécharger en PDF";
// 	button.type = "button";
// 	button.addEventListener("click", async e => await PDF.generatePDF(e, content, elementsToNotDisplay));
// 	beforeWhere.insertAdjacentElement("beforebegin", button);
// }
const { default: PDF } = await import("./modules/pdf.mjs");

const elToNotDisplay = document.querySelectorAll("#skillsForm, #skillsInfo, button, #copyright, h2");
const content = document.getElementById("content");
const footer = document.querySelector("footer");
await PDF.createButtonPDF(footer, content, elToNotDisplay);