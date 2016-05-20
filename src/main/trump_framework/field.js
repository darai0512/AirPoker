'use strict';
/*
 * This class has only minimal functions.
 */
export default class Field {
  constructor() {
    this.pool_ = [];
    this.trash_ = [];
  }

  set(playerName, card) {
    this.pool_.push({player: playerName, card: card});
  }

  view() {
    return this.pool_;
  }

  // @todo 引数cardの時も実装する this.pool_.splice(i, 1)
  return() {
    let cards = [];
    for (let i=0;i < this.pool_.length;i++) {
      cards.push(this.pool_[i].card);
    }  
    this.pool_ = [];
    return cards;
  }

  trash(card) {
    this.trash_.push(card);
  }
}
