 import {Config} from "./config.js"
 
 /**
  * Sends a trade request from an actor to another actor.
  * 
  * @param {string} sourceActorId The source actor the item will come from.
  * @param {string} destinationActorId The destination actor the item will go to.
  * @param {string} itemId The item id on the source actor.
  * @param {number} quantity The number of items that will be sent.
  */
export function requestItemTrade(sourceActorId, destinationActorId, itemId, quantity) {
    console.log(sourceActorId);
    console.log(destinationActorId);
    console.log(itemId);
    console.log(quantity);

    game.socket.emit(Config.Socket, {
        sourceActorId,
        destinationActorId,
        itemId,
        quantity
    });
}

/**
 * Returns a list of active player characters.
 * 
 * @param {string|undefined} excludedId An id which can be excluded from the results
 */
export function getPlayerCharacters(excludedId) {
    let results = [];
    game.users.forEach(u => {
        let char = u.character;
        if (char && char.id !== excludedId) {
            results.push({
                "name": char.name,
                "img": char.img,
                "id": char.id
            });
        }
    });

    return results;
}
