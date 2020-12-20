import {requestItemTrade, getPlayerCharacters} from "./lets-trade-core.js"

// Loads the template.
const templateName = "modules/lets-trade-5e/templates/trade-window.html";
loadTemplates(templateName);

/**
 * A window where the users selects a character to send an item.
 * 
 */
export default class TradeWindow extends Application {
    constructor(data, options) {
        super(options);
        this.data = data;
        this._selectedActorId = false;
    }

    /** 
     * @override
     * */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: templateName,
            classes: ["lets-trade-window"],
            width: 400,
            height: 800,
            jQuery: true
        });
    }

    /**
     * The id of the selected trade target
     * 
     * @returns {string|false} Id or false if none were selected.
     */
    get selectedCharacterId() {
        return this._selectedActorId;
    }

    /** @override */
    get title() {
        return "Trade Window";
    }

    /** @override */
    getData(options) {
        let characters = getPlayerCharacters(this.data.actorId);

        return {
            item: {
                name: this.data.item.name,
                img: this.data.item.img
            },
            characters
        };
    }

    /** @override */
    activateListeners(html) {
        html.find("li.actor.directory-item").click(this._selectActor.bind(this));
        html.find("button.cancel").click(this.close.bind(this));
        html.find("button.submit").click(this._submit.bind(this));
    }

    /** @override */
    async close(options) {
        return super.close(options);
    }

    /** 
     * Selects the target character.
     * @private
     */
    async _selectActor(event) {
        event.preventDefault();
        let actorElement = event.currentTarget.closest(".actor.directory-item");
        this._selectedActorId = actorElement.dataset.actorId;

        this.element.find(".actor.directory-item").removeClass("active");
        actorElement.classList.add("active");

        if (this.selectedCharacterId) {
            this.element.find("button.submit").attr("disabled", false);
        }
    }

    /**
     * Submit the trade request
     * @private
     */
    async _submit() {
        if (this.selectedCharacterId) {
            requestItemTrade(
                this.data.actorId,
                this.selectedCharacterId,
                this.data.item.id,
                this.quantity
            );
        }
        this.close();
    }
}
