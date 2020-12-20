import {Config} from "./config.js";
import {sendTradeRequest} from "./lets-trade-core.js"
import TradeRequest from "./trade-request.js";

/**
 * A window where the users selects a character to send an item.
 * 
 */
export default class TradeWindow extends Application {
    constructor(data, options) {
        super(options);
        this.data = data;
        this._selectedActor = null;
        this.quantity = this.data.item.data.data.quantity;
    }

    /** 
     * @override
     * */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: Config.TradeWindowTemplate,
            classes: ["lets-trade-window"],
            width: 400,
            height: 800,
            jQuery: true
        });
    }

    /**
     * The actor data of the selected trade target
     * 
     * @returns {object|null} actor data or null if none were selected.
     */
    get selectedActor() {
        return this._selectedActor;
    }

    /** @override */
    get title() {
        return "Trade Window";
    }

    /** @override */
    getData(options) {
        return {
            item: {
                name: this.data.item.name,
                img: this.data.item.img
            },
            characters: this.data.characters,
            quantity: this.quantity,
            showquantity: this.quantity !== 1
        };
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find("li.actor.directory-item").click(this._selectActor.bind(this));
        html.find("button.cancel").click(this.close.bind(this));
        html.find("button.submit").click(this._submit.bind(this));
        html.find(".quantity-input").change(this._changeQuantity.bind(this));
        html.find(".quantity-quick-btn").click(this._quickChangeQuantity.bind(this));
    }

    /**
     * Handles the change in quantity
     * @private
     */
    _changeQuantity(event) {
        event.preventDefault();
        this.updateQuantity(parseInt(event.target.value));
    }

    /**
     * Handles quick quantity buttons (one, half, all)
     * @private
     */
    _quickChangeQuantity(event) {
        event.preventDefault();
        let qsize = event.currentTarget.dataset.qsize;
        let qmax = this.data.item.data.data.quantity;
        let q = 1;
        switch (qsize) {
            case "one": 
                q = 1;
                break;
            case "half":
                q = Math.floor(qmax / 2);
                break;
            case "all":
                q = qmax;
                break;
        }
        this.updateQuantity(q);
    }

    /**
     * Updates the quantity
     * 
     * @param {number} newQuantity 
     */
    updateQuantity(newQuantity) {
        newQuantity = clampNumber(newQuantity, 1, this.data.item.data.data.quantity);
        this.quantity = newQuantity;
        this.element.find(".quantity-input")[0].value = this.quantity;
    }

    /** 
     * Selects the target character.
     * @private
     */
    async _selectActor(event) {
        event.preventDefault();
        let actorElement = event.currentTarget.closest(".actor.directory-item");
        this._selectedActor = this.data.characters.find(c => c.id === actorElement.dataset.actorId);

        this.element.find(".actor.directory-item").removeClass("active");
        actorElement.classList.add("active");

        if (this.selectedActor) {
            this.element.find("button.submit").attr("disabled", false);
        }
    }

    /**
     * Submit the trade request
     * @private
     */
    async _submit() {
        if (this.selectedActor) {
            console.log(this.selectedActor);
            sendTradeRequest(new TradeRequest({
                sourceUserId: game.userId,
                sourceActorId: this.data.actorId,

                destinationActorId: this.selectedActor.id,
                destinationUserId: this.selectedActor.userId,

                itemId: this.data.item.id,
                quantity: this.quantity
            }));
        }
        this.close();
    }
}
