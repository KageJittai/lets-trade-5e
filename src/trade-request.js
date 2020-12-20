/**
 * A class represting a single trade request.
 */

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
        return this.sourceActor.getOwnedItem(this.itemId);
    }

    /**
     * Checks to see if the request can still be performed.
     * 
     * @returns {boolean} If the trade is still valid
     */
    isValid() {
        if (!game.users.get(this.sourceUserId).active) {
            return false;
        }

        if (!game.users.get(this.destinationUserId).active) {
            return false;
        }

        if (!this.sourceActor || !this.item) {
            return false;
        }

        if (this.item.data.data.quantity < this.quantity) {
            return false;
        }

        return true;
    }
}