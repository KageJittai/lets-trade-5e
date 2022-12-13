import { Config } from "./config.js";
import { openItemTrade } from "./openItemTrade.js";

export default class ItemWindow extends Application {
    constructor(data, options) {
        super(options);
        this.data = data;
    }

    /**
     * @override
     * */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: Config.ItemWindowTemplate,
            classes: ["lets-trade-window"],
            width: 500,
            jQuery: true
        });
    }

    /** @override */
    get title() {
        return game.i18n.localize("LetsTrade5E.TradeWindowTitle");
    }

    /** @override */
    getData(options) {
        return {
            items: this.data.items
        }
    }

    activateListeners(html) {
        html.find("li").click(this.handleItemClick.bind(this));
    }

    handleItemClick(event) {
        const element = event.currentTarget.closest("[data-item-id]");
        const {itemId} = element.dataset;

        openItemTrade(this.data.actorId, itemId);
        this.close();
    }
}