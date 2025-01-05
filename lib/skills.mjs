import Skill from './skill.mjs';

/** Classe des compétences
 * @typedef {Object} Skills
 * @property {boolean} init Si l'app est initialisée
 * @property {boolean} testStorage Test si le navigateur est compatible avec localStorage
 */
export default class Skills {
    /** Formulaire des compétences
    * @type {HTMLFormElement} 
    */
    #form = document.getElementById('skillsForm');
    /** Formulaire des compétences
    * @type {HTMLUListElement} 
    */
    #list = document.getElementById('skillsList');
    /** Input du nom de la compétence
     * @type {HTMLInputElement} 
     */
    #formName = document.getElementById('name');
    /** Input de la description de la compétence
     * @type {HTMLInputElement} 
     */
    #formDesc = document.getElementById('description');
    /** Input du niveau de la compétence
     * @type {HTMLSelectElement} 
     */
    #formLevel = document.getElementById('level');
    /** Message d'erreur
     * @type {HTMLParagraphElement} 
     */
    #errorOutput = document.getElementById('skillsInfo');

    /** Objet de l'app
     * @type { { skills: string[] } } ID des compétences
    */
    #appParse = { skills: [] };

    /** Tableau des compétences
     * @type { Skill[] } Compétences
    */
    #skills = this.#getSkills();

    /** Crée une instance des compétences
    * @param {HTMLFormElement | null} form Formulaire des compétences
    * @param {HTMLUListElement | null} list Liste des compétences
    */
    constructor(form = null, list = null, errorOutput = null) {
        this.#form = form ? form : this.#form;
        this.#list = list ? list : this.#list;
        this.#errorOutput = errorOutput ? errorOutput : this.#errorOutput;

        this.#formName = this.#form.querySelector('#name');
        this.#formDesc = this.#form.querySelector('#description');
        this.#formLevel = this.#form.querySelector('#level');

        if (!Skills.testStorage) {
            this.logger("Impossible d'utiliser localStorage", 'error');
            throw new Error("Impossible d'utiliser localStorage");
        };

        if (!this.#init()) this.logger("App mal initialisé", 'warn');
    }

    /** Test si le navigateur est compatible avec localStorage
     * @returns {boolean} Vrai si réussite, sinon Faux
     */
    static get testStorage() {
        return (() => {
            try {
                localStorage.setItem('test', 'test');
                localStorage.removeItem('test');
                console.log('localStorage OK');
                return true;
            } catch (error) {
                console.warn('localStorage KO');
                return false;
            }
        })();
    }

    /** Initialise l'app
     * @returns {boolean} Vrai si réussite, sinon Faux
     */
    #init() {
        try {
            const APP = localStorage.getItem(Skills.appName);

            if (APP) this.#appParse = JSON.parse(APP);

            this.#skills = this.#getSkills();
            this.buildList();
            return this.save();
        } catch (e) {
            this.logger("Impossible d'initialiser l'app", 'error', e);
            return false;
        }
    }

    /** Récupère les compétences enregistrées
     * @returns {Skill[]} skills
     */
    #getSkills() {
        try {
            /** Tableau des compétences
             * @type { Skill[] } Compétences
            */
            const skills = [];
            this.#appParse.skills.forEach(id => {
                skills.push(new Skill({ id: id }));
            })
            this.logger("Compétences récupéré");
            return skills;
        } catch (e) {
            this.logger("Impossible de récupérer les compétences", 'error', e);
            return [];
        }
    }

    /** Sauvegardes l'app
     * @returns {boolean} Vrai si réussite, sinon faux
     */
    save() {
        try {
            localStorage.setItem(Skills.appName, JSON.stringify(this.#appParse));
            this.logger("App Sauvegarder");
            return true;
        } catch (e) {
            this.logger("Impossible de sauvegarder l'app", 'error', e);
            return false;
        }
    }

    /** Ajoute une compétence
     * @param {string} name 
     * @param {string} level 
     * @param {string | null} description 
     */
    addSkill(name, level, description = null) {
        if (!name || !level || name === '' || level === '') name, level = null;
        if (!description || description === '') description = null;

        try {
            const skill = new Skill({ name: name, level: level, description: description });
            this.#appParse.skills.push(skill.sID);
            this.#skills.push(skill);
            this.save();
            this.buildList();
            this.logger("Compétence ajoutée", 'success');
        } catch (e) {
            this.logger(e.message, 'error', e);
        }
    }

    /** Construit la liste des compétences */
    buildList() {
        /** Créer un boutton
         * @param {{
         *  text: string,
         *  listener: () => {}
         * }}
         * @returns {HTMLButtonElement}
         */
        function createButton({ text, listener }) {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', listener);
            return button;
        }

        try {
            this.#list.innerHTML = '';
            this.#skills.forEach(skill => {
                const li = document.createElement('li');

                /** Bouton à généré
                 * @type {{
                 *  text: string,
                 *  listener:  () => {}
                 * }[]}
                 */
                const buttons = [
                    {
                        text: "Modifier",
                        listener: () => this.editSkill(skill)
                    }, {
                        text: "Supprimer",
                        listener: () => this.deleteSkill(skill)
                    }
                ]

                li.innerHTML = `<strong>${skill.name}</strong> - ${skill.description || 'Pas de description'} - ${skill.level}`;

                buttons.forEach(button => {
                    const b = createButton({ text: button.text, listener: button.listener });
                    li.appendChild(b);
                })

                this.#list.appendChild(li);

                this.logger("Liste affiché");
            });
        } catch (e) {
            this.logger("Impossible de construire la liste des compétences", 'error', e);
        }
    }

    /** Modifie une compétence
     * @param {Skill} skill Compétence à modifier
     * @returns {boolean} Vrai si réussite, sinon Faux
     */
    editSkill(skill) {
        try {
            if (skill) {
                this.#formName.value = skill.name;
                this.#formDesc.value = skill.description;
                this.#formLevel.value = skill.level;

                this.#form.querySelector('button').textContent = "Modifier";

                this.#form.addEventListener('submit', e => {
                    e.preventDefault();
                    skill.name = this.#formName.value;
                    skill.description = this.#formDesc.value;
                    skill.level = this.#formLevel.value;
                    this.#skills.splice(this.#skills.indexOf(skill), 1);
                    this.#appParse.skills.splice(this.#appParse.skills.indexOf(skill.sID), 1);
                    localStorage.removeItem(skill.sID);

                    this.save();
                    this.buildList();
                    this.#form.reset();
                    this.#form.querySelector('button').textContent = "Ajouter";
                    this.logger("Compétence modifié", 'success');
                });

                return true;
            } else {
                this.logger("Impossible de trouver la compétence", 'error');
                return false;
            }
        } catch (e) {
            this.logger("Impossible de modifier la compétence", 'error', e);
            return false;
        }
    }

    /** Supprime une compétence
     * @param {Skill} skill Compétence à supprimer
     * @returns {boolean} Vrai si réussite, sinon Faux
     */
    deleteSkill(skill) {
        try {
            if (skill) {
                localStorage.removeItem(skill.sID);
                this.#appParse.skills.splice(this.#appParse.skills.indexOf(skill.sID), 1);

                // Retire la compétence du tableau
                this.#skills.splice(this.#skills.indexOf(skill), 1);
                this.save();
                this.buildList();
                this.logger("Compétence supprimé", 'success');
                return true;
            } else {
                this.logger("Impossible de trouver la compétence", 'error');
                return false;
            }
        } catch (e) {
            this.logger("Impossible de supprimer la compétence", 'error', e);
            return false;
        }
    }

    /** Logger
     * @param {string} message 
     * @param {"info" | "warn" | "error" | "success"} type 
     * @param {Error | null} technical
     */
    logger(message, type = 'info', technical = null) {
        switch (type) {
            case 'info':
                this.#errorOutput.style.color = "blue";
                break;
            case 'warn':
                this.#errorOutput.style.color = "orange";
                break;
            case 'error':
                this.#errorOutput.style.color = "red";
                break;
            case 'success':
                this.#errorOutput.style.color = "green";
                break;
            default:
                this.#errorOutput.style.color = "black";
                break;
        }
        this.#errorOutput.textContent = message;
        if (technical) console.error(technical);
    }

    static appName = "Skills";
}