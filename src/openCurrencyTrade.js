import TradeWindow from "./trade-window.js";
import { getPlayerCharacters } from "./lets-trade-core.js";

export function openCurrencyTrade(actorId) {
    const currency = game.actors.get(actorId).system.currency;
    const characters = getPlayerCharacters(actorId);

    if (characters.length === 0) {
        ui.notifications.warn(game.i18n.localize("LetsTrade5E.NoPCToTradeWith"));
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
