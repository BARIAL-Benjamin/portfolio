/** Page actuel */
const currentPage = (() => {
  const e = location.pathname.split("/");
  const p = e.find(p => p.includes(".html")) ?? e[e.length - 1];
  return p.includes(".html") ? p.replace(".html", "") : p;
})();

/** Année actuel */
const thisYear = new Date().getFullYear();

/** Mon âge actuel */
const age = (() => {
  const n = new Date();
  const m = n.getMonth() - 4;
  return m < 0 || (m === 0 && n.getDate() < 15)
    ? thisYear - 2002 - 1
    : thisYear - 2002;
})();

document
  .querySelectorAll(".age")
  .forEach((el) => (el.textContent = `${age} ans`));

document
  .querySelectorAll(".rot")
  .forEach((rot) => (rot.style.transform = `rotate(${rot.dataset.rot}deg)`));

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

document.getElementById(
  "copyright"
).textContent = `© ${thisYear} - Tous droit réservé`;

const header = document.querySelector("header");
const navUL = header.querySelector("nav > ul");
const links = navUL.querySelectorAll("body > header a");

links.forEach(link => {
  link.href = `/portfolio/pages/${link.dataset.page}`;
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
  if (cursor) {
    window.addEventListener("mousemove", (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    document.body
      .querySelectorAll("a, button, input, textarea, select")
      .forEach((el) => {
        el.addEventListener("mouseover", () => {
          cursor.style.backgroundImage = "none";
        });
        el.addEventListener("mouseout", () => {
          const cursorLink = location.href.includes('pages') ? '../assets/cursor.webp' : './assets/cursor.webp';
          cursor.style.backgroundImage = `url("${cursorLink}")`;
        });
      });
  }
})();