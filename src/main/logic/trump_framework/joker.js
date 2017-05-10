'use strict';
import {Card} from "./card.js";

export default class Joker extends Card {
  constructor() {
    super(null, null);
  }

  /*
   * turnInto
   *  Turns this joker into a Card obj
   *
   * @param {number} number - a key of number
   * @param {string} suit - a key of Suits
   */
  turnInto(number, suit) {
    this.setNumber_(number);
    this.setSuit_(suit);
  }
}
