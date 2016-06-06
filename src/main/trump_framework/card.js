'use strict';

export const SUITS = {
  HEART: Symbol('heart'),
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
   * @param int number
   * @param str suit = <Suits_key>
   */
  constructor(number, suit) {
    this.number;
    this.suit;
    setNumber_(number);
    setSuit_(suit);
  }

  setNumber_(number){
    if (NUMBERS.indexOf(number) > -1) {
      this.number = number;
    }
  }

  setSuit_(suit){
    if (Object.keys(SUITS).indexOf(suit) > -1) {
      this.suit = SUITS[suit];
    }
  }
}
