'use strict';
import {Card} from "./card.js";

export default class Joker {
  constructor() {
    this.number;
    this.suit;
  }

  /**
   * Sets joker
   * @member int number
   * @member str suit
   */
  transform(number, suit) {
    const transCard = new Card(number, suit);
    this.number = transCard.number;
    this.suit   = transCard.suit;
  }
}
