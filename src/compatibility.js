export function injectTidySheet(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $("ol.currency li.currency-header", element)[0];
    let insert = $(`<li class="currency-header flexrow"></li>`).append(currencyIcon);
    insertPoint.after(insert[0]);
}

export function injectDnd5e(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $("ol.currency .currency-convert", element)[0];
    insertPoint.after(currencyIcon);
}

export function injectDndbcs(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $("ol.currency", element);
    insertPoint.prepend(currencyIcon);
}

export function injectCb5es(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $(".currency h3", element);
    insertPoint.append(currencyIcon);
}

export function injectOgl5e(element, actorId, callback) {
    let currencyIcon = $(`<a class="currency-control currency-trade" title="Send to Player">
        <i class="fas fa-balance-scale-right"></i>
    </a>`)[0];
    currencyIcon.dataset.actorId = actorId;
    currencyIcon.addEventListener("click", callback);

    let insertPoint = $(".inventory-sidebar .currency", element);
    insertPoint.append($(`<div style="text-align: center; padding-top: 10px;"></div>`).append(currencyIcon));
}