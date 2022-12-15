import ItemWindow from "./item-window.js"
import {Config} from "./config.js"
import {receiveTrade, completeTrade, denyTrade} from "./lets-trade-core.js"
import {getCompatibility} from "./compatibility.js"
import { openItemTrade } from "./openItemTrade.js"
import { openCurrencyTrade } from "./openCurrencyTrade.js"

Hooks.once("setup", async function () {
    if (game.system.id === "dnd5e") {
        Hooks.on("renderActorSheet5eCharacter", renderInjectionHook);
        Hooks.on("renderActorSheet5eCharacterNew", renderInjectionHook);
    
        //LootSheet5eNPC support
        Hooks.on("renderLootSheet5eNPC", renderInjectionHook);
    } else if (game.system.id === "a5e") {
        Hooks.on("getActorSheet5eCharacterHeaderButtons", renderHeaderButton);
    }

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

    if (!compatibility.addHeaderButton) {
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
}

function renderHeaderButton(sheet, headers) {
    console.log("Let's Trade 5e | Header Button Render");
    headers.unshift({
        label: "LetsTrade5E.TradeButton",
        class: "trade-button",
        icon: "fas fa-balance-scale-right",
        onclick: onHeaderClick.bind({actorId: sheet.object.id})
    });
}

/**
 * Handles the trade event click.
 * @param {event} event
 */
function onItemTradeClick(event) {
    event.preventDefault();
    const ele = event.currentTarget.closest(".item-trade");

    const actorId = ele.dataset.actorId;
    const itemId = ele.dataset.itemId;
    openItemTrade(actorId, itemId)
}

function onCurrencyTradeClick(event) {
    event.preventDefault();
    const ele = event.currentTarget.closest(".currency-trade");

    const actorId = ele.dataset.actorId;
    openCurrencyTrade(actorId)
}

function onHeaderClick(event) {
    console.log("Let's Trade 5e | Opening item sheet trade dialog for " + this.actorId);

    const actor = game.actors.get(this.actorId);
    const items = actor.items.filter(item => item.type === "object");

    const itemWindow = new ItemWindow({
        items,
        actorId: this.actorId
    });
    itemWindow.render(true);
}