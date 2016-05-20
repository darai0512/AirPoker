'use strict';
// @todo 1 roundの勝利に最適化されていてgame勝利に最適化されていない
export default class ModelInterface {
  constructor(modelerName) {
    this.name = modelerName;
    this.card_ = null;
    this.rankFlag = true;
    this.action_ = 'check'; // 'raise', 'call', 'fold'
    this.betTips_ = 0;
  }
  setCard(hands, remainingCards, hasTips) {
    throw new Error('Implement me. Please set card & rankFlag.');
    return this.card_;
  }
  bet(oCard, oAction, oBetTips, oHasTips, hasTips) { // 'o' means opponent.
    throw new Error('Implement me. maxRaise is a half of total betTips');
    return {action: this.action_, tip: this.betTips_};
  }
}
