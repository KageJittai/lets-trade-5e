import TradeWindow from "./trade-window.js";
import { getPlayerCharacters } from "./lets-trade-core.js";

export function openItemTrade(actorId, itemId) {
    const item = game.actors.get(actorId).items.get(itemId);
    const characters = getPlayerCharacters(actorId);

    if (characters.length === 0) {
        ui.notifications.warn(game.i18n.localize("LetsTrade5E.NoPCToTradeWith"));
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
