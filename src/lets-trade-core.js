import {Config} from "./config.js"
import TradeRequest from "./trade-request.js";

 /**
  * Sends a trade request from an actor to another actor.
  *
  * @param {TradeRequest} tradeRequest trade request to be processed.
  */
export function sendTradeRequest(tradeRequest) {
    if (tradeRequest.isValid()) {
        ui.notifications.notify(game.i18n.localize("LetsTrade5E.TradeSent"));

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
        ui.notifications.error(game.i18n.localize("LetsTrade5E.TradeNoLongerValid"));
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
    tradeRequest.applyToSource();
    ui.notifications.notify(game.i18n.format("LetsTrade5E.TradeAccepted", {name: tradeRequest.destinationActor.name}));
}

export function denyTrade(tradeData) {
    let tradeRequest = new TradeRequest(tradeData);
    ui.notifications.notify(game.i18n.format("LetsTrade5E.TradeRejected", {name: tradeRequest.destinationActor.name}));
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
            title: game.i18n.localize("LetsTrade5E.TradeIncomingTitle"),
            content: "<p>" + game.i18n.format("LetsTrade5E.TradeDescription", {name: tradeRequest.sourceActor.name, item: tradeRequest.name()}) + "</p>",
            buttons: {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("LetsTrade5E.TradeConfirm"),
                    callback: () => tradeConfirmed(tradeRequest)
                },
                two: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("LetsTrade5E.TradeDeny"),
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
        tradeRequest.applyToDestination();
        sendChatMessage(tradeRequest);

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
        ui.notifications.error(game.i18n.localize("LetsTrade5E.TradeNoLongerValid"));
    }
}

function tradeDenied(tradeRequest) {
    game.socket.emit(Config.Socket, {
        data: tradeRequest._data,
        handler: tradeRequest.sourceUserId,
        type: "denied"
    });
}
/**
 * Outputs a chat message to the GM when a trade is executed.
 *
 * @param {TradeRequest} tradeRequest The finished trade request.
 */
function sendChatMessage(tradeRequest) {
    let chatMessage = {
        user: game.userId,
        speaker: ChatMessage.getSpeaker(),
        content: game.i18n.format("LetsTrade5E.TradeDescriptionGM", {sender: tradeRequest.sourceActor.name, receiver: tradeRequest.destinationActor.name, item: tradeRequest.name()}),
        whisper: game.users.filter(u => u.isGM).map(u => u.id)
    };

    chatMessage.whisper.push(tradeRequest.sourceUserId);

    ChatMessage.create(chatMessage);
}