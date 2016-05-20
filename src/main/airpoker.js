'use strict';
import Rule from './trump_framework/rule.js';

/*
 * YourPoint = RankPoint + HighCard (+ SuitOrder <- in the future)
 *   HighCard is from 2 to 1(=14).
 *   Suit is from 1 to 4.
 */
const RANK_POINTS = {
  RoyalStraightFlush: 200,
  StraightFlush: 180,
  FourCard: 160,
  FullHouse: 140,
  Flush: 120,
  RoyalStraight: 100,
  Straight: 80,
  ThreeCard: 60,
  TwoPair: 40,
  OnePair: 20,
  HighCard: 0
};

export default class AirPocker extends Rule {
  constructor(players) {
    // init
    const setDeck = {deckNum: 1, JockerNum: 0};
    const setPlayers = [];
    let field = {};
    for (let i=0;i < players.length;i++) {
      setPlayers.push({name: players[i], options: {hasTips: 25, betTips: 0, action: null, maxRankFlag: true}});
      field[players[i]] = null;
    }
    const initHandNum = Math.floor((setDeck.deckNum * 52 + setDeck.JockerNum) / 5 / players.length); // 5
    super(setDeck, setPlayers, initHandNum);

    // member
    this.betTurn = players;
    this.round = 1; // judge回数. judgeは手札がなくなるまで
    this.field = field; // field.jsは煩雑さ回避のため使わない方針に変更
    this.remainingCards = this.deck_.showRemains();
  }

  /*
   * initHand_
   *   @override
   *   Sums up five card numbers.
   *
   *   @param str playerName
   *   @param int initHandNum
   */
  initHand_(playerName, initHandNum) {
    for (let j = 0; j < initHandNum; j++) {
      let sumup = 0;
      // Sums up five card numbers.
      for (let x = 0; x < 5; x++) {
        let card = this.deck_.draw();
        sumup += Number(card.number);
      }
      this.players_[playerName].receive(sumup);
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
    return this.players_[playerName].viewHand();
  }

  /**
   * getStatus
   *   Gets players' bet status
   *
   *   @return obj status
   */
  getStatus() {
    let status = {};
    Object.keys(this.players_).forEach((name) => {
      status[name] = { remainingAir: this.players_[name].hasTips
        ,betAir: this.players_[name].betTips
        ,action: this.players_[name].action };
    });
    return status;
  }

  /*
   * setField
   *   @override
   *   Sets card to field.
   *
   *   @param  str playerName
   *   @param  int card
   */
  setField(playerName, card) {
    this.field[playerName] = this.players_[playerName].send(card);
  }

  /*
   * setRankFlag
   *   sets maxRankFlag
   *
   *   @param  str playerName
   *   @param  boolean rankFlag
   */
  setRankFlag(playerName, rankFlag) {
    this.players_[playerName].maxRankFlag = rankFlag;
  }

  preBet() {
    let player;
    //Object.values(this.players_).forEach((player) => {
    Object.keys(this.players_).forEach((name) => {
      player = this.players_[name];
      player.hasTips -= this.round;
      player.betTips += this.round;
      player.action = null;
    });
  }

  prePlayer(playerName) {
    let index = this.betTurn.indexOf(playerName);
    return index > 0 ? this.betTurn[index - 1] : this.betTurn[this.betTurn.length - 1];
  }
  
  /*****************************
   * actionCandidates
   *   @param  str playerName
   *   @return arr actions
   *****************************/
  actionCandidates(playerName) {
    let actions = ['raise', 'call', 'check', 'fold'];
    let status = this.getStatus();
    let prePlayer = this.prePlayer(playerName);
    if (status[playerName].action == 'check' || status[prePlayer].action == 'raise') {
      actions.splice(actions.indexOf('check'),1);
    } else if (status[playerName].action == null && status[prePlayer].action == null) {
      actions.splice(actions.indexOf('fold'),1);
      actions.splice(actions.indexOf('call'),1);
    }
    return actions;
  }

  /*****************************
   * bet
   *   @param  str     playerName
   *   @param  str     action
   *   @param  int     tip
   *   @return boolean nextBet -> true:go to next bet/false:end 
   *****************************/
  bet(playerName, action, tip) {
    let nextBet = true;
    const player = this.players_[playerName];
    const preAction = player.action;
    player.action = action;
    // @todo this.actionCandidates()でcheck, throw削除
    if (action === 'raise') {
      if (tip > this.getMaxRaise()) {
        throw new Error('Not Allowed to put the value');
      }
      player.hasTips -= tip;
      player.betTips += tip;
    } else if (action === 'call') {
      const opponent = this.betTurn.indexOf(playerName) - 1 > -1
                     ? this.players_[this.betTurn[this.betTurn.indexOf(playerName) - 1]]
                     : this.players_[this.betTurn[this.betTurn.length - 1]];
      player.hasTips -= opponent.betTips - player.betTips;
      player.betTips = opponent.betTips;
    } else if (action === 'check') {
      if (preAction == 'check') {
        throw new Error('Not Allowed to put the value');
      }
      if( this.players_.every((player, i) => player.action === 'fold') ) {
        nextBet = false;
      }
    } else if (action === 'fold') {
      nextBet = false;
    } else {
      throw new Error('Not Allowed to put the value');
    }
    return nextBet;
  }

  getMaxRaise() {
    let totalTips = 0;
    let num = 0;
    Object.keys(this.players_).forEach((name) => {
      num++;
      totalTips += this.players_[name].betTips;
    });
    return Math.floor(totalTips / num);
  }

  /*****************************
   * judge
   *   Compares their Poker rank.
   *   If both of ranks are the same, compare a highest number of the hand.
   *   Ace(1) is highest. Two(2) is lowest.
   *   If they are the same, draw. (Suit and the Second Number are not considered.)
   *
   *   @return obj {winner: PlayerName, rank: rankName, cards: cards} <- round winner
   *****************************/
  judge() {
    let result = {rank: null, cards: null, winner: null};
    let totalTip = 0;
    let maxPoint = 0;
    Object.keys(this.players_).forEach((name) => {
      let player = this.players_[name];
      let playerMax = {rank: null, point: 0, comb: null};
      if (player.maxRankFlag) {
        let rankCandidates = this.getCombinations_(this.field[name]);
        for (let i=0;i < rankCandidates.length;i++) {
          let comb = rankCandidates[i];
          let {name: rank, highCardPoint: point} = this.rankByNumbers_(comb);
          if (rank === 'Straight'
            || rank === 'HighCard'
            || rank === 'RoyalStraight') {
            // @todo Suits管理 - 上から順に使う & disasterはSuitをずらせないかcheck
            rank = rank === 'HighCard' ? 'Flush' : rank + 'Flush';
          }
          point += RANK_POINTS[rank];
          if (point > playerMax.point) {
            playerMax.point = point;
            playerMax.comb = comb;
            playerMax.rank = rank;
          }
        }
      }
      if (maxPoint < playerMax.point) {
        result.rank = playerMax.rank;
        maxPoint = playerMax.point;
        result.cards = playerMax.comb;
        result.winner = name;
      }
      totalTip += player.betTips;
      player.betTips = 0;
      // delete cards from sideField
      this.field[name] = null;
    });
    this.round++;
    this.betTurn.push(this.betTurn.shift()); // changeBetTurn
    // get Air
    this.players_[result.winner].hasTips += totalTip;
    return result;
  }

  /**
   * getCombinations_
   *   Returns an array of five numbers to be the arguement number by summing them.
   *
   *   @param  int    num
   *   @return arr(2) combinations
   */
  getCombinations_(num) {
      let combinations = [];
    if (num > 5 && num < 65) {
      for (let a = 1; a < num / 5; a++) {
        let max2 = num - a;
        for (let b = a; b <= max2 / 4; b++) {
          let max3 = max2 - b;
          for (let c = b; c <= max3 / 3; c++) {
            let max4 = max3 - c;
            for (let d = c; d <= max4 / 2; d++) {
              let e = max4 - d;
              if (e <= 13) {
                combinations.push([a, b, c, d, e]);
              }
            }
          }
        }
      }
    }
    return combinations;
  }

  /*
   * rankByNumbers_
   *   @param  arr [int,int,int,int,int]
   *   @return obj {highCardPoint: int, name: str}
   */
  rankByNumbers_(numbers) {
    let rank = {highCardPoint: 0, name: null};
    numbers.sort((a, b) => a - b);
    if (this.isStraight_(numbers)) {
      rank.name = 'Straight';
      // Adds highest number
      rank.highCardPoint = numbers[0] === 1 ? 14 : numbers[numbers.length - 1];
    } else if (this.isRoyalStraight_(numbers)) {
      rank.name = 'RoyalStraight';
    }
    if (!rank.name) {
      // check pairs
      const pairs = numbers.reduce((pair, n) => {
        pair[n] = pair[n] ? pair[n] + 1 : 1;
        return pair;
      }, {});
      switch (Object.keys(pairs).length) {
        case 2:
          // 4-1 or 3-2
          for (let n in pairs) {
            if (pairs[n] === 4) {
              rank.name = 'FourCard';
              rank.highCardPoint = +n === 1 ? 14 : +n;
              break;
            } else if (pairs[n] === 3) {
              rank.name = 'FullHouse';
              rank.highCardPoint = +n === 1 ? 14 : +n;
              break;
            }
          }
          break;
        case 3:
          // 3-1-1 or 2-2-1
          for (let n in pairs) {
            if (pairs[n] === 3) {
              rank.name = 'ThreeCard';
              rank.highCardPoint = +n === 1 ? 14 : +n;
              break;
            } else if (pairs[n] === 2) {
              rank.name = 'TwoPair';
              rank.highCardPoint = rank.highCardPoint > +n ? rank.highCardPoint : +n;
            }
          }
          break;
        case 4:
          // 2-1-1-1
          rank.name = 'OnePair';
          for (let n in pairs) {
            if (pairs[n] === 2) {
              rank.highCardPoint = +n;
              break;
            }
          }
          break;
        default:
          rank.name = 'HighCard';
          rank.highCardPoint = numbers[0] === 1 ? 14 : numbers[numbers.length - 1];
      }
    }
    return rank;
  }

  isFlash_(cards) {
    return cards.every((e, i, self) => e.suit === self[0].suit);
  }

  isStraight_(numbers) {
    return numbers.every((e, i, self) => e + 1 === self[i + 1] || i+1 === self.length);
  }

  isRoyalStraight_(numbers) {
    return numbers.toString() === [1, 10, 11, 12, 13].toString();
  }
}
