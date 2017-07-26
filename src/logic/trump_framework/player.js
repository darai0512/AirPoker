export default class Player {
  // This class doesn't manage the property of "turn".
  constructor(name, options) {
    this.hand_ = [];
    // require param
    this.name = name;
    // optional params
    if (typeof options === 'object') {
      for (const key of Object.keys(options)) {
        this[key] = options[key];
      }
    }
  }

  /*
   *  Gets a card
   */
  receive(card) {
    this.hand_.push(card);
  }

  viewHand() {
    return this.hand_;
  }

  /*
   * Trashes(or Gives) a card at random or specified.
   */
  send(card) {
    let indexNum;
    if (typeof card === 'undefined') {
      indexNum = Math.floor(Math.random() * this.hand_.length);
    } else {
      indexNum = this.hand_.indexOf(card);
    }
    this.hand_.splice(indexNum, 1); // trash
    /*
    this.hand_.some(function(v, i){
      if (v==hand) hands.splice(i,1);
    });
    */
    return card || this.hand_[indexNum];
  }
}
