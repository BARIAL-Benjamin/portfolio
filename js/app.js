/** Page actuel */
const currentPage = (() => {
    const e = location.pathname.split('/');
    const p = e.find(p => p.includes('.html')) ?? e[e.length - 1];
    if (e.includes('.html')) p = p.replace('.html', '')
    return p;
})();

/** Mon âge actuel */
const age = (() => {
    const b = new Date("2002-04-15");
    const n = new Date();
    const m = n.getMonth() - b.getMonth();
    let y = n.getFullYear() - b.getFullYear();
    if (m < 0 || (m === 0 && n.getDate() < b.getDate())) y--;
    return y;
})();

document.querySelectorAll('.age').forEach(el => el.textContent = `${age} ans`);
document.querySelectorAll('.rot').forEach(rot => rot.style.transform = `rotate(${rot.dataset.rot}deg)`);

const header = document.querySelector('header');
const navUL = header.querySelector('nav > ul');
const links = navUL.querySelectorAll('a');

links.forEach(link => {
    console.log(link.dataset.page);
    
    link.href = `/${link.dataset.page}`;
    if (link.dataset.page === currentPage) link.classList.add('line');
});

if (currentPage === 'competences') {
    const Skills = await(async () => {
        return (await import('/lib/skills.min.mjs')).default;
    })();

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


if (currentPage === 'contact') {
    const captcha = document.getElementById('captcha');
    const res = captcha.value;

    const contact = document.querySelector('form');
    contact.addEventListener('submit', e => { if (res !== 4_294_967_296) e.preventDefault(); })
}