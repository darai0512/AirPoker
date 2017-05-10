import Deck from "./deck.js"
import Player from './player.js';

/**
 * Defines trump rule
 */
export default class Rule {
  // setPlayers' order decide player's turn
  constructor(setDeck, setPlayers, initHandNum) {
    this.deck_ = new Deck(setDeck);
    this.players_ = [];
    for (let i=0; i < setPlayers.length; i++) {
      // @todo :array index order by bet turn
      let setPlayer = setPlayers[i];
      this.players_[setPlayer.name] = new Player(setPlayer.name, setPlayer.options);
      this.initHand_(setPlayer.name, initHandNum);
    }
  }

  /**
   * initHand_
   *   Deals out <initNum> cards to each player.
   *
   *   @param  str playerName
   *   @param  int initHandNum
   */
  initHand_(playerName, initHandNum) {
    if (initHandNum > 0) {
      for (let j = 0; j < initHandNum; j++) {
        this.players_[playerName].receive(this.deck_.draw());
      }
    }  
  }

  /**
   * findCandidates
   *   Finds cards to be able to put on the table from Player's hand and Table.
   *
   *   @param  str playerName
   *   @return arr candidates
   */
  findCandidates(playerName) {
    throw new Error('Implement me');
  }

  setField(playerName, card, options) {
    throw new Error('Implement me');
  }

  // not required??
  bet(playerName, action, tip) {
    throw new Error('Implement me');
  }

  judge() {
    throw new Error('Implement me');
  }

  gameset() {
    throw new Error('Implement me');
  }
}
