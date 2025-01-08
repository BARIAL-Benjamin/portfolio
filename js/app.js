import Skills from '/lib/skills.mjs';

const currentPage = location.pathname.replaceAll('/', '').replace(/.*\.html/, '');

console.log(currentPage);

/** Mon âge actuel */
const age = (() => {
    const b = new Date("2002-04-15");
    const n = new Date();
    const m = n.getMonth() - b.getMonth();
    let y = n.getFullYear() - b.getFullYear();
    if (m < 0 || (m === 0 && n.getDate() < b.getDate())) y--;
    return y;
})();

const ages = document.querySelectorAll('.age');

ages.forEach(el => {
    el.textContent = `${age} ans`;
});

const header = document.querySelector('header');
const navUL = header.querySelector('nav > ul');
const links = navUL.querySelectorAll('a');

links.forEach(link => {
    if (link.dataset.page === currentPage) {
        link.classList.add('line');
    }
});

if (currentPage === 'competences') {
    /** Formulaire des compétences
     * @type {HTMLFormElement} 
     */
    const form = document.getElementById('skillsForm');
    /** Input du nom de la compétence
     * @type {HTMLInputElement} 
     */
    const name = document.getElementById('name');
    /** Input de la description de la compétence
     * @type {HTMLInputElement} 
     */
    const desc = document.getElementById('description');
    /** Input du niveau de la compétence
     * @type {HTMLSelectElement} 
     */
    const level = document.getElementById('level');
    /** Message d'erreur
     * @type {HTMLParagraphElement} 
     */
    const error = document.getElementById('error');

    /** Instance de Skills pour gérer les compétences
     * @type {Skills}
     */
    const skills = new Skills();

    form.addEventListener('submit', e => {
        e.preventDefault();
        skills.addSkill(name.value, level.value, desc.value);
        form.reset();
    });
};