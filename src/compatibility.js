function currencyDefault(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $("ol.currency .currency-convert", element)[0];
    insertPoint.after(currencyIcon);
}

function currencyTidySheet(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $("ul.currency li.currency-header", element)[0];
    let insert = $(`<li class="currency-header flexrow"></li>`).append(currencyIcon);
    insertPoint.before(insert[0]);
}

function currencyDndbcs(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $("ol.currency", element);
    insertPoint.prepend(currencyIcon);
}

function currencyCb5es(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $(".currency h3", element);
    insertPoint.append(currencyIcon);
}

function currencyOgl5e(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $(".inventory-sidebar .currency", element);
    insertPoint.append($(`<div style="text-align: center; padding-top: 10px;"></div>`).append(currencyIcon));
}

/**
 * Returns a list item dom elements belonging to the sheet elements
 * 
 * @param {object} element The sheet element
 * 
 * @returns {object[]}
 */
function fetchDefault(element) {
    let items = $(".inventory.tab .item", element);
    if (items.length === 0) {
        items = $(".inventory-list.items-list .item", element);
    }

    return items;
}

/**
 * Injects the trade icon onto a DOM item element.
 * 
 * @param {object} item 
 * @param {function} callback
 */
function itemDefault(item, actorId, callback) {
    const edit = $(".item-control.item-edit", item);
    const icon = $(`<a class="item-control item-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];

    icon.dataset.itemId = item.dataset.itemId;
    icon.dataset.actorId = actorId;
    icon.addEventListener("click", callback);

    if (edit[0])
        edit[0].after(icon);
}

function itemTidy5e(item, actorId, callback) {
    const edit = $(".item-control.item-edit", item);
    const icon = $(`<a class="item-control item-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
        <span class="control-label">Send to Player</span>
    </a>`)[0];

    icon.dataset.itemId = item.dataset.itemId;
    icon.dataset.actorId = actorId;
    icon.addEventListener("click", callback);

    if (edit[0])
        edit[0].after(icon);
}

/**
 * Returns a compatibility name for sheet class
 * 
 * @param {string[]} sheetClasses List of classes belonging to the sheet
 * 
 * @returns {string}
 */
export function sheetCompatibilityName(sheetClasses) {
    // List of supported sheets
    const names = [
        "tidy5e",
        "alt5e",
        "dndbcs",
        "cb5es",
        "ogl5e-sheet"
    ];

    for (let i = 0; i < names.length; i++) {
        if (sheetClasses.includes(names[i])) {
            return names[i];
        }
    }

    // Default Sheet
    return "defualt";
}

export const compatibility = {
    "tidy5e": {
        currency: currencyTidySheet,
        fetch: fetchDefault,
        item: itemTidy5e
    },
    "alt5e": {
        currency: currencyDefault,
        fetch: fetchDefault,
        item: itemDefault
    },
    "dndbcs": {
        currency: currencyDndbcs,
        fetch: fetchDefault,
        item: itemDefault
    },
    "cb5es": {
        currency: currencyCb5es,
        fetch: fetchDefault,
        item: itemDefault
    },
    "ogl5e-sheet": {
        currency: currencyOgl5e,
        fetch: fetchDefault,
        item: itemDefault
    },
    "defualt": {
        currency: currencyDefault,
        fetch: fetchDefault,
        item: itemDefault
    },
};