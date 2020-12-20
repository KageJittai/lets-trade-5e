import TradeWindow from "./trade-window.js"
import {Config} from "./config.js"

export function loadHooks() {
    Hooks.once("init", async function () {
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

            edit[0].after(icon);
        }
    });

    game.socket.on(Config.Socket, data => {
        console.log("Socket Message", data);
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
    const item = game.actors.get(actorId).getOwnedItem(itemId);

    const tw = new TradeWindow({actorId, item});
    tw.render(true);
}
