/** Page actuel */
const currentPage = (() => {
  const e = location.pathname.split("/");
  const p = e.find((p) => p.includes(".html")) ?? e[e.length - 1];
  return p.includes(".html") ? p.replace(".html", "") : p;
})();

const thisYear = new Date().getFullYear();

/** Mon âge actuel */
const age = (() => {
  const n = new Date();
  const m = n.getMonth() - 4;
  return m < 0 || (m === 0 && n.getDate() < 15)
    ? thisYear - 2002 - 1
    : thisYear - 2002;
})(); // calculé sinon en dur

document
  .querySelectorAll(".age")
  .forEach((el) => (el.textContent = `${age} ans`));
document
  .querySelectorAll(".rot")
  .forEach((rot) => (rot.style.transform = `rotate(${rot.dataset.rot}deg)`));
document.getElementById(
  "copyright"
).textContent = `© ${thisYear} - Tous droit réservé`;
document
  .querySelectorAll(".mail")
  .forEach(
    (el) =>
      (el.innerHTML =
        '<a href="mailto:contact@benjamin-pro.com">contact@benjamin-pro.com</a>')
  );
document
  .querySelectorAll(".tel")
  .forEach(
    (el) => (el.innerHTML = '<a href="tel:06 49 20 38 03">06 49 20 38 03</a>')
  );

const header = document.querySelector("header");
const navUL = header.querySelector("nav > ul");
const links = navUL.querySelectorAll("body > header a");

links.forEach((link) => {
  link.href = `/${link.dataset.page}`;
  link.classList.toggle(
    "line",
    link.dataset.page === currentPage ||
      (currentPage === "index" && link === links[0])
  );
});

if (currentPage === "competences") {
  const { default: Skills } = await import("./modules/skills.min.mjs");

  /** Formulaire des compétences
   * @type {HTMLFormElement}
   */
  const form = document.getElementById("skillsForm");
  /** Input du nom de la compétence
   * @type {HTMLInputElement}
   */
  const name = document.getElementById("name");
  /** Input de la description de la compétence
   * @type {HTMLInputElement}
   */
  const desc = document.getElementById("description");
  /** Input du niveau de la compétence
   * @type {HTMLSelectElement}
   */
  const level = document.getElementById("level");
  /** Message d'erreur
   * @type {HTMLParagraphElement}
   */
  const error = document.getElementById("error");

  /** Instance de Skills pour gérer les compétences
   * @type {Skills}
   */
  const skills = new Skills();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    skills.addSkill(name.value, level.value, desc.value);
    form.reset();
  });
}

if (currentPage === "contact") {
  const captcha = document.getElementById("captcha");
  const res = captcha.value;

  const contact = document.querySelector("form");
  contact.addEventListener("submit", (e) => {
    if (res !== 4_294_967_296) e.preventDefault();
  });
}

(() => {
  const cursor = document.getElementById("cur");
  window.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
  });
  document
    .querySelectorAll("a, button, input, textarea, select")
    .forEach((el) => {
      el.addEventListener("mouseover", () => {
        cursor.style.backgroundImage = "none";
      });
      el.addEventListener("mouseout", () => {
        cursor.style.backgroundImage = 'url("/assets/cursor.webp")';
      });
    });
})();

(async () => {
  const { default: PDF } = await import("./modules/pdf.mjs");

  const button = document.createElement("button");
  const elToNotDisplay = Array.from(
    document.querySelectorAll(
      "#skillsForm, #skillsInfo, button, #copyright, h2"
    )
  );
  
  elToNotDisplay.push(button);
  

  const content = document.getElementById("content");
  button.textContent = "Télécharger en PDF";
  button.type = "button";
  button.addEventListener(
    "click",
    async () => await PDF.generatePDF(content, elToNotDisplay)
  );
  document.querySelector("footer").insertAdjacentElement("beforebegin", button);
})();