import TradeWindow from "./trade-window.js"
import {Config} from "./config.js"
import {receiveTrade, completeTrade, denyTrade, getPlayerCharacters} from "./lets-trade-core.js"
import {getCompatibility} from "./compatibility.js"

Hooks.once("setup", async function () {
    //loadTemplates([Config.TradeWindowTemplate]);

    game.socket.on(Config.Socket, packet => {
        let data = packet.data;
        let type = packet.type;
        let handler = packet.handler;
        if (handler === game.userId) {
            if (type === "request") {
                receiveTrade(data);
            }
            if (type === "accepted") {
                completeTrade(data);
            }
            if (type === "denied") {
                denyTrade(data);
            }
        }
    });

    console.log("Let's Trade 5e Loaded");
});

async function renderInjectionHook(sheet, element, character) {
    const actorId = sheet.actor.id;
    const compatibility = getCompatibility(sheet);
    try {
        compatibility.currency(element, actorId, onCurrencyTradeClick);
    }
    catch (e) {
        console.error("Let's Trade 5e | Failed to inject currency icon onto character sheet.");
    }

    let items = compatibility.fetch(element);

    for (let item of items) {
        try {
            compatibility.item(item, actorId, onItemTradeClick);
        }
        catch (e) {
            console.error("Let's Trade 5e | Failed to inject onto item: ", item);
        }
    }

    console.log("Let's Trade 5e | Added trade icons to sheet for actor " + actorId);
}

Hooks.on("renderActorSheet5eCharacter", renderInjectionHook);
Hooks.on("renderActorSheet5eCharacterNew", renderInjectionHook);

//LootSheet5eNPC support
Hooks.on("renderLootSheet5eNPC", renderInjectionHook);

/**
 * Handles the trade event click.
 * @param {event} event
 */
function onItemTradeClick(event) {
    event.preventDefault();
    const ele = event.currentTarget.closest(".item-trade");

    const actorId = ele.dataset.actorId;
    const itemId = ele.dataset.itemId;
    const item = game.actors.get(actorId).getOwnedItem(itemId);
    const characters = getPlayerCharacters(actorId);

    if (characters.length === 0) {
        ui.notifications.warn("No player characters available to trade with.")
    }
    else {
        const tw = new TradeWindow({
            actorId,
            item,
            characters
        });
        tw.render(true);
    }
}

function onCurrencyTradeClick(event) {
    event.preventDefault();
    const ele = event.currentTarget.closest(".currency-trade");

    const actorId = ele.dataset.actorId;
    const currency = game.actors.get(actorId).data.data.currency;
    const characters = getPlayerCharacters(actorId);

    if (characters.length === 0) {
        ui.notifications.warn("No player characters available to trade with.")
    }
    else {
        const tw = new TradeWindow({
            actorId,
            currencyMax: currency,
            characters
        });
        tw.render(true);
    }
}
