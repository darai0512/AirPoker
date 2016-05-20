'use strict';
import ModelInterface from './airpokermodel.js'

export default class Model extends ModelInterface {
  constructor() {
    super('darai0512');
  }
  setCard(hands, remainingCards) {
    this.card_ = hands[0];
    return this.card_;
  }
  bet(oCard, oAction, oBetTips, oHasTips, hasTips) {
    if (oAction == null || oAction === 'check') {
      this.action_ = 'check';
    } else {
      this.action_ = 'call';
    }
    return {action: this.action_, tip: this.betTips_};
  }
}
