import ModelInterface from './model_interface.js';

export default class Model extends ModelInterface {
  constructor() {
    super('darai0512');
  }
  setCard(hands, remainingCards) {
    this.card_ = hands[0];
    return this.card_;
  }
  bet(oCard, oAction, oBetTips, oHasTips, hasTips) {
    const probability = Math.random();
    if (oAction === null || oAction === 'check') {
      // 1st tern
      if (probability < 0.6)
        this.action_ = 'check';
      else {
        this.action_ = 'raise';
        this.betTips_ = 1;
      }
    } else if (oCard > this.catd_ && probability < 0.7 ) {
      this.action_ = 'call';
    } else {
      this.action_ = 'raise';
      this.betTips_ = 1;
    }
    return {action: this.action_, tip: this.betTips_};
  }
}
