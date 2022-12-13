function currencyDefault(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="${game.i18n.localize("LetsTrade5E.Send")}">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $("ol.currency .currency-convert", element)[0];
    insertPoint.after(currencyIcon);
}

function currencyTidySheet(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="${game.i18n.localize("LetsTrade5E.Send")}">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $("ul.currency li.currency-header", element)[0];
    let insert = $(`<li class="currency-header flexrow"></li>`).append(currencyIcon);
    insertPoint.before(insert[0]);
}

function currencyDndbcs(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="${game.i18n.localize("LetsTrade5E.Send")}">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $("ol.currency", element);
    insertPoint.prepend(currencyIcon);
}

function currencyCb5es(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="${game.i18n.localize("LetsTrade5E.Send")}">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $(".currency h3", element);
    insertPoint.append(currencyIcon);
}

function currencyOgl5e(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="${game.i18n.localize("LetsTrade5E.Send")}">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $(".inventory-sidebar .currency", element);
    insertPoint.append($(`<div style="text-align: center; padding-top: 10px;"></div>`).append(currencyIcon));
}

function currencySw5e(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="${game.i18n.localize("LetsTrade5E.Send")}">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $(".currency", element)[0];
    insertPoint.append(currencyIcon);
}

function currencyLootSheet5e(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="${game.i18n.localize("LetsTrade5E.Send")}">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $("a.currency-loot", element)[0];
    insertPoint.after(currencyIcon);
}

/**
 * Returns a list item dom elements belonging to the sheet elements
 *
 * @param {object} element The sheet element
 *
 * @returns {object[]}
 */
function fetchDefault(element) {
    return  $(".inventory.tab .item", element);
}

function fetchOgl5e(element) {
    return $("section.inventory .inventory-list.items-list .item", element);
}

function fetchLootSheet5e(element) {
    return  $(".inventory-list .item", element);
}

/**
 * Injects the trade icon onto a DOM item element.
 *
 * @param {object} item
 * @param {function} callback
 */
function itemDefault(item, actorId, callback) {
    const edit = $(".item-control.item-edit", item);
    const icon = $(`<a class="item-control item-trade" title="${game.i18n.localize("LetsTrade5E.Send")}">
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
    const icon = $(`<a class="item-control item-trade" title="${game.i18n.localize("LetsTrade5E.Send")}">
        <i class="fas fa-balance-scale-right"></i>
        <span class="control-label">${game.i18n.localize("LetsTrade5E.Send")}</span>
    </a>`)[0];

    icon.dataset.itemId = item.dataset.itemId;
    icon.dataset.actorId = actorId;
    icon.addEventListener("click", callback);

    if (edit[0])
        edit[0].after(icon);
}

function itemLootSheet5e(item, actorId, callback) {
    const edit = $(".item-control.item-loot", item);
    const icon = $(`<a class="item-control item-trade" title="${game.i18n.localize("LetsTrade5E.Send")}">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];

    icon.dataset.itemId = item.dataset.itemId;
    icon.dataset.actorId = actorId;
    icon.addEventListener("click", callback);

    if (edit[0])
        edit[0].after(icon);
}

/**
 * Updates the currency
 *
 * @param currency {object} object to update currency on
 * @param key {string}type of currency to update
 * @param subtractValue {number} amount to subtract
 */
function updateCurrencyDefault(currency, key, subtractValue) {
    currency[key] -= subtractValue;
}

function updateCurrencyLootSheet5e(currency, key, subtractValue) {
    currency[key].value = (parseInt(currency[key].value) - subtractValue).toString();
}

/**
 * Parses currencyMax
 *
 * @param currencyMax {object} object to retrieve currencyMax from
 */
function parseCurrencyMaxDefault(currencyMax) {
    return currencyMax;
}

function parseCurrencyMaxLootSheet5e(currencyMax) {
    return parseInt(currencyMax.value);
}

function sheetCompatibilityName(sheetClassesRaw) {
    // List of supported sheets
    const names = Object.keys(compatibility).filter(e => e !== "default");

    const sheetClasses = sheetClassesRaw.length === 1
        && sheetClassesRaw[0].indexOf(" ") >= 0 ? sheetClassesRaw[0].split(" ") : sheetClassesRaw;

    for (let compatabilityName of names) {
        if (sheetClasses.includes(compatabilityName)) {
            return compatabilityName;
        }
    }

    // Default Sheet
    return "default";
}

const compatibility = {
    "tidy5e": {
        currency: currencyTidySheet,
        fetch: fetchDefault,
        item: itemTidy5e,
        updateCurrency: updateCurrencyDefault,
        parseCurrencyMax: parseCurrencyMaxDefault
    },
    "alt5e": {
        currency: currencyDefault,
        fetch: fetchDefault,
        item: itemDefault,
        updateCurrency: updateCurrencyDefault,
        parseCurrencyMax: parseCurrencyMaxDefault
    },
    "dndbcs": {
        currency: currencyDndbcs,
        fetch: fetchDefault,
        item: itemDefault,
        updateCurrency: updateCurrencyDefault,
        parseCurrencyMax: parseCurrencyMaxDefault
    },
    "cb5es": {
        currency: currencyCb5es,
        fetch: fetchDefault,
        item: itemDefault,
        updateCurrency: updateCurrencyDefault,
        parseCurrencyMax: parseCurrencyMaxDefault
    },
    "ogl5e-sheet": {
        currency: currencyOgl5e,
        fetch: fetchOgl5e,
        item: itemDefault,
        updateCurrency: updateCurrencyDefault,
        parseCurrencyMax: parseCurrencyMaxDefault
    },
    "sw5e":{
        currency: currencySw5e,
        fetch: fetchDefault,
        item: itemDefault,
        updateCurrency: updateCurrencyDefault,
        parseCurrencyMax: parseCurrencyMaxDefault
    },
    "tidysw5e":{
        currency: currencyTidySheet,
        fetch: fetchDefault,
        item: itemTidy5e,
        updateCurrency: updateCurrencyDefault,
        parseCurrencyMax: parseCurrencyMaxDefault
    },
    "loot-sheet-npc": {
        currency: currencyLootSheet5e,
        fetch: fetchLootSheet5e,
        item: itemLootSheet5e,
        updateCurrency: updateCurrencyLootSheet5e,
        parseCurrencyMax: parseCurrencyMaxLootSheet5e
    },
    "a5e": {
        updateCurrency: updateCurrencyDefault,
    },
    "default": {
        currency: currencyDefault,
        fetch: fetchDefault,
        item: itemDefault,
        updateCurrency: updateCurrencyDefault,
        parseCurrencyMax: parseCurrencyMaxDefault
    },
};

/**
 * Returns a compatibility object for sheet class
 *
 * @param {object} sheet
 *
 * @returns {object}
 */
export function getCompatibility(sheet) {
    let sheetName = sheetCompatibilityName(sheet.options.classes);
    if (game.system.id === "a5e") {
        sheetName = "a5e";
    }
    return compatibility[sheetName];
}
