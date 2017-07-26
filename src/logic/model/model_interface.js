
export default class ModelInterface {
  constructor(modelerName) {
    this.name = modelerName;
    this.card_ = null;
    this.action_ = 'check'; // 'raise', 'call', 'fold'
    this.betTips_ = 0;
    this.result_ = {};
  }
  setCard(hands, remainingCards, hasTips) {
    throw new Error('Implement me. Please set card.');
    return this.card_;
  }
  bet(oCard, oAction, oBetTips, oHasTips, hasTips) { // 'o' means opponent. @todo hasTipsは総和からの差で出せる
    throw new Error('Implement me. maxRaise is a half of total betTips');
    return {action: this.action_, tip: this.betTips_};
  }
  result(round, result) {
    this.result_[round] = result;
  }
}
