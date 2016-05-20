import Deck from "../../main/logic/trump_framework/deck.js";

var set = {'deck_num': 1, 'jocker_num': 0};
var deck = new Deck(set);

console.log(deck.checkNum());
console.log(deck.showTop());
deck.shuffle();
console.log(deck.showTop());
var card = deck.showTop();
console.log(deck.draw(card));
console.log(deck.checkNum());
