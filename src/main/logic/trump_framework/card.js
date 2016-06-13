'use strict';

export const SUITS = {
  HEART: Symbol.for('heart'),
  DIAMOND: Symbol.for('diamond'),
  SPADE: Symbol.for('spade'),
  CLUB: Symbol.for('club')
};

export const NUMBERS = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13
];

export class Card {
  /**
   * Creates new card instance by suit and number.
   * Suit is at either one of SPADE,DIAMOND,CLUB or HEART.
   *
   * @param {number} number - a key of number
   * @param {string} suit - a key of Suits
   */
  constructor(number, suit) {
    this.number = null;
    this.suit = null;
    this.setNumber_(number);
    this.setSuit_(suit);
  }

  setNumber_(number) {
    if (NUMBERS.indexOf(number) > -1) {
      this.number = number;
    }
  }

  setSuit_(suit) {
    if (Object.keys(SUITS).indexOf(suit) > -1) {
      this.suit = SUITS[suit];
    }
  }
}
