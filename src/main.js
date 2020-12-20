import TradeWindow from "./trade-window.js"
import {Config} from "./config.js"
import {receiveTrade, completeTrade, denyTrade, getPlayerCharacters} from "./lets-trade-core.js"

Hooks.once("setup", async function () {
    //loadTemplates([Config.TradeWindowTemplate]);

    game.socket.on(Config.Socket, packet => {
        let data = packet.data;
        let type = packet.type;
        let handler = packet.handler;
        console.log("Socket Message", packet);
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

Hooks.on("renderActorSheet5eCharacter", async function (sheet, element, character) {
    let items = $(".inventory.tab .item", element);
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let edit = $(".item-control.item-edit", item);
        let icon = $(`<a class="item-control item-trade" title="Send to Player">
            <i class="fas fa-balance-scale-right"></i>
        </a>`)[0];

        icon.dataset.itemId = item.dataset.itemId;
        icon.dataset.actorId = sheet.actor.id;
        icon.addEventListener("click", onItemTradeClick);

        if (edit[0])
            edit[0].after(icon);
    }
});

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

    const tw = new TradeWindow({
        actorId,
        item,
        characters
    });
    tw.render(true);
}
