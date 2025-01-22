/** Gestion des compétences
 * @typedef {Object} Skill
 * @property {string} id Identifiant de la compétence
 * @property {string} name Nom de la compétence
 * @property {string} level Niveau de la compétence
 * @property {string | null} description Description de la compétence
 */
export default class Skill {
    /** Identifiant de la compétence */
    sID;
    /** Nom de la compétence */
    name;
    /** Niveau de la compétence */
    level;
    /** Description de la compétence */
    description;

    /** Crée une instance d'une compétence
     * @param {{
     *  name: string | null,
     *  level: string | null,
     *  description: string | null,
     *  id: string | null
     * }}
     */
    constructor({ name, level, description, id }) {
        this.sID = id;
        const res = this.id;
        this.sID = res.id;
        if (res.isNew) {
            if (!name || !level) {
                throw new Error('Le nom et le niveau de la compétence sont obligatoires');
            }
            this.name = name;
            this.level = level;
            this.description = description || null;
        } else {
            const skill = Skill.skill(this.sID);
            if (skill) {
                this.name = skill.name;
                this.level = skill.level;
                this.description = skill.description || null;
            } else {
                throw new Error('Compétence non trouvée');
            }
        }
        Skill.save(this);
    }

    /** Enregistre la compétence
     * @param {Skill} skill 
     * @returns {boolean} Vrai si la compétence est enregistrée, sinon Faux
     */
    static save(skill) {
        try {
            localStorage.setItem(skill.sID, JSON.stringify(skill));
            return true;
        } catch (error) {
            return false;
        }
    }

    /** Récupère la compétence
     * @param {string} id Identifiant de la compétence
     * @returns {Skill} Compétence
     */
    static skill(id) { return JSON.parse(localStorage.getItem(id)); }

    /** Retourne l'ID ou le génère
     * @returns {{
     *  id: string,
     *  isNew: boolean
     * }} ID de la compétence + Vrai si l'ID est déjà créé, sinon Faux
    */
    get id() {
        if (this.sID) return { id: this.sID, isNew: false };
        const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let o = "";
        for (let r = 0; r < 8; r++) {
            o += t[Math.floor(t.length * Math.random())];
        }
        return { id: o, isNew: true };
    }
}