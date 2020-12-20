import {Config} from "./config.js"
import TradeRequest from "./trade-request.js";

 /**
  * Sends a trade request from an actor to another actor.
  * 
  * @param {TradeRequest} tradeRequest trade request to be processed.
  */
export function sendTradeRequest(tradeRequest) {
    if (tradeRequest.isValid()) {
        ui.notifications.notify("Trade request sent.");

        if (tradeRequest.sourceUserId === tradeRequest.destinationUserId) {
            // Local pathway
            receiveTrade(tradeRequest._data);
        }
        else {
            game.socket.emit(Config.Socket, {
                data: tradeRequest._data,
                handler: tradeRequest.destinationUserId,
                type: "request"
            });
        }
    }
    else {
        ui.notifications.error("Trade request is no longer valid.");
    }
}

/**
 * Returns a list of active player characters.
 * 
 * @param {string|undefined} excludedId An id which can be excluded from the results
 */
export function getPlayerCharacters(excludedId) {
    let results = [];
    game.users.forEach(u => {
        let char = u.character;
        if (u.active && char && char.id !== excludedId) {
            results.push({
                "userId": u.id,
                "name": char.name,
                "img": char.img,
                "id": char.id
            });
        }
    });

    return results;
}

export function completeTrade(tradeData) {
    let tradeRequest = new TradeRequest(tradeData);
    let item = tradeRequest.item;

    // Remove items from sheet.
    if (item.data.data.quantity <= tradeRequest.quantity) {
        tradeRequest.sourceActor.deleteOwnedItem(item.id);
    }
    else {
        item.update({data: {
            quantity: item.data.data.quantity - tradeRequest.quantity
        }});
    }

    ui.notifications.notify(`${tradeRequest.destinationActor.name} accepted your trade request.`);
}

export function denyTrade(tradeData) {
    let tradeRequest = new TradeRequest(tradeData);
    ui.notifications.notify(`${tradeRequest.destinationActor.name} rejected your trade request.`);
}

/**
 * Handles the incoming trade request.
 * 
 * @param {object} tradeData The incoming trade request
 */
export function receiveTrade(tradeData) {
    let tradeRequest = new TradeRequest(tradeData);
    // Only handle if we're the target user.
    if (tradeRequest.destinationUserId === game.userId) {
        let d = new Dialog({
            title: "Incoming Trade Request",
            content: `<p>${tradeRequest.sourceActor.name} is sending you ${tradeRequest.quantity} ${tradeRequest.item.name}(s). Do you accept?</p>`,
            buttons: {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Confirm",
                    callback: () => tradeConfirmed(tradeRequest)
                },
                two: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Deny",
                    callback: () => tradeDenied(tradeRequest)
                }
            },
            default: "two",
        });
        d.render(true);
    }
}

function tradeConfirmed(tradeRequest) {
    if (tradeRequest.isValid()) {
        let destinationActor = tradeRequest.destinationActor;
        let item = tradeRequest.item;
        let itemData = duplicate(item.data);
        itemData.data.quantity = tradeRequest.quantity;
        destinationActor.createOwnedItem(itemData);

        if (tradeRequest.sourceUserId === tradeRequest.destinationUserId) {
            completeTrade(tradeRequest);
        }
        else {
            game.socket.emit(Config.Socket, {
                data: tradeRequest._data,
                handler: tradeRequest.sourceUserId,
                type: "accepted"
            });
        }
    }
    else {
        ui.notifications.error("Trade request is no longer valid.");
    }
}

function tradeDenied(tradeRequest) {
    game.socket.emit(Config.Socket, {
        data: tradeRequest._data,
        handler: tradeRequest.sourceUserId,
        type: "denied"
    });
}