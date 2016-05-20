'use strict';

import {Card, Suits, Numbers} from "./card.js";
import Joker from "./joker.js";
/*
 * Creates Card class in only this class.
 * 'deck' array is not shuffled. When drawing, the card is selected at random every time. It is because this is client side program.
 */
export default class Deck {
  constructor( {deckNum: deckNum, jockerNum: jockerNum} ) {
    this.deck_ = [];
    for (let i = 0; i < deckNum; i++) {
      Object.keys(Numbers).forEach(function(num) {
        Object.keys(Suits).forEach(function(suit) {
          this.push(new Card(num, suit));
        }, this);
      }, this.deck_);
    }
    for (var j = 0; j < jockerNum; j++) {
      this.deck_.push(new Joker());
    }
    this.shuffle(); // 要素全部宣言しないとだめ? this.topCardIndex_ = null;
  }

  /*
   * Gets a card.
   * That is the same card as param, or at random if param is nothing.
   * @param  obj:Card or nothing card
   * @return obj:Card            drawCard
   */
  draw(card) {
    let indexNum;
    if (typeof card == 'undefined') {
      indexNum = this.topCardIndex_ || Math.floor(Math.random() * this.deck_.length);
    } else {
      indexNum = this.deck_.indexOf(card);
    }
    let drawCard = this.deck_[indexNum];
    this.remove_(indexNum);
    this.topCardIndex_ = null;
    return drawCard;
  }

  /*
   * shows the all remaining cards.
   * @return array obj:Card  this.deck_
   */
  showRemains() {
    return this.deck_;
  }

  /*
   * shows a top card on this deck.
   * @return obj card => Card or Joker class object
   */
  showTop() {
    this.topCardIndex_ = this.topCardIndex_ || Math.floor(Math.random() * this.deck_.length);
    return this.deck_[this.topCardIndex_];
  }

  /*
   * Shuffles this deck.
   */
  shuffle() {
    this.topCardIndex_ = null;
  }

  getBack(cards) {
    if (Array.isArray(cards)) {
      this.deck_.concat(cards);
    } else {
      this.deck_.push(cards);
    }
  }

  remove_(indexNum) {
    this.deck_.splice(indexNum, 1);
  }
}
