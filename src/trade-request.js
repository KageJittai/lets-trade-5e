/**
 * A class represting a single trade request.
 */
import {getCompatibility} from "./compatibility.js";

export default class TradeRequest {
    /**
     * @private
     */
    _data = {};

    /**
     * Creates the trade request.
     * 
     * @param {Internal data} data 
     */
    constructor(data) {
        this._data = data;
    }

    /**
     * The userId of the source actor
     */
    get sourceUserId() {
        return this._data.sourceUserId;
    }

    /**
     * The userId of the destination actor
     */
    get destinationUserId() {
        return this._data.destinationUserId;
    }

    /**
     * Source actor id, who is sending the item.
     */
    get sourceActorId() {
        return this._data.sourceActorId;
    }

    /**
     * The receving actor id.
     */
    get destinationActorId() {
        return this._data.destinationActorId;
    }

    /**
     * The id on the source actor.
     */
    get itemId() {
        return this._data.itemId;
    }

    /** 
     * How many items will be passed over.
     */
    get quantity() {
        return this._data.quantity;
    }

    /**
     * Returns the source actor
     */
    get sourceActor() {
        return game.actors.get(this.sourceActorId);
    }

    get destinationActor() {
        return game.actors.get(this.destinationActorId);
    }

    /**
     * Returns the trade item.
     */
    get item() {
        return this.sourceActor.items.get(this.itemId);
    }

    get currency() {
        return this._data.currency;
    }

    /**
     * Checks to see if the request can still be performed.
     * 
     * @returns {boolean} If the trade is still valid
     */
    isValid() {
        // Ensure both source and destination users are logged in.
        if (!game.users.get(this.sourceUserId).active) {
            return false;
        }
        if (!game.users.get(this.destinationUserId).active) {
            return false;
        }

        // Actors should still exist.
        if (!this.sourceActor || !this.destinationActor) {
            return false;
        }

        if (this.item) {
            // Item should exist and have a valid quantity
            if (this.item.system.quantity < this.quantity) {
                return false;
            }
        }
        else if (this.currency) {
            // Currency should be between 0 and max.
            let max = this.sourceActor.system.currency;
            let has_value = false;
            for (let key in this.currency) {
                if (this.currency[key] > max[key] || this.currency[key] < 0) {
                    return false;
                }
                if (this.currency[key] > 0) {
                    has_value = true;
                }
            }

            // Some currency should be attached.
            if (!has_value) {
                return false;
            }
        }
        else {
            // No currency or items found.
            return false;
        }

        return true;
    }

    /**
     * Removes the trade value from the source.
     */
    applyToSource() {
        if (this.item) {
            let item = this.item;
            if (item.system.quantity <= this.quantity) {
                this.sourceActor.deleteEmbeddedDocuments("Item", [item.id]);
            }
            else {
                item.update({data: {
                    quantity: item.system.quantity - this.quantity
                }});
            }
        }
        else {
            const compatibility = getCompatibility(this.sourceActor.sheet);
            let currency = duplicate(this.sourceActor.system.currency);
            for (let key in this.currency) {
                if(this.currency[key] > 0) {
                    compatibility.updateCurrency(currency, key, this.currency[key]);
                }
            }
            this.sourceActor.update({
                system: {
                    currency: currency
                }
            });
        }
    }

    /**
     * Adds the trade value to the destination
     */
    applyToDestination() {
        if (this.item) {
            let itemData = duplicate(this.item);
            itemData.system.quantity = this.quantity;
            this.destinationActor.createEmbeddedDocuments("Item", [itemData]);
        }
        else {
            let currency = duplicate(this.destinationActor.system.currency);
            for (let key in this.currency) {
                currency[key] += this.currency[key];
            }
            this.destinationActor.update({
                system: {
                    currency: currency
                }
            });
        }
    }

    /**
     * Abstraction of a name
     */
    name() {
        if (this.item) {
            return `${this.quantity} ${this.item.name}(s)`;
        }
        else {
            let message = "";
            for (let key in this.currency) {
                if (this.currency[key] > 0) {
                    message += `${this.currency[key]}${key} `;
                }
            }
            return message;
        }
    }
}