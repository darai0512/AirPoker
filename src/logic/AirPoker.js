import Rule from './trump_framework/rule_interface';
import {Card, SUITS, NUMBERS} from './trump_framework/card';

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
    const field = {};
    for (let i = 0; i < players.length; i++) {
      setPlayers.push({
        name: players[i],
        options: {hasTips: 25, betTips: 0, action: null}
      });
      field[players[i]] = null;
    }
    const initHandNum = Math.floor((setDeck.deckNum * 52 + setDeck.JockerNum) / 5 / players.length); // 5
    super(setDeck, setPlayers, initHandNum);

    // member
    this.betTurn = players;
    this.round = 1;
    this.field = field; // field.jsは煩雑さ回避のため使わない方針に変更
    this.remainingCards = {};

    // set remainingCards
    NUMBERS.forEach((number) => {
      this.remainingCards[number] = [];
      // this.remainingCards[number] = Object.values(SUITS);
      Object.keys(SUITS).forEach((k) => {
        this.remainingCards[number].push(SUITS[k]);
      }, this);
    }, this);
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
        const card = this.deck_.draw();
        sumup += Number(card.number);
      }
      this.players_[playerName].receive(sumup);
    }
  }

  /*
   * findCandidates
   *   Finds cards to be able to put on the table from Player's hand and Table.
   *
   *   @param  {String} playerName
   *   @return {Array} candidates
   */
  findCandidates(playerName) {
    return this.players_[playerName].viewHand();
  }

  /**
   * getStatus
   *   Gets players' bet status @TODO Deprecated
   *
   *   @return {Object} status
   */
  getStatus() {
    const status = {};
    for (const name of Object.keys(this.players_)) {
      status[name] = {
        remainingAir: this.players_[name].hasTips,
        betAir: this.players_[name].betTips,
        action: this.players_[name].action
      };
    }
    return status;
  }

  /**
   * getRemainingAir
   *   @TODO Deprecated
   *
   *   @return {Object} RemainingAir
   */
  getRemainingAir() {
    const air = {};
    for (const name of Object.keys(this.players_)) {
      air[name] = this.players_[name].hasTips;
    }
    return air;
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
   * initBet
   *   Pays entry fee according to every round
   *
   *   @return {String} - firstBetPlayerName
   */
  initBet() {
    for (const name of Object.keys(this.players_)) {
      const player = this.players_[name];
      player.hasTips -= this.round;
      player.betTips += this.round;
      player.action = null;
    }
    return this.betTurn[0];
  }

  /*
   * prePlayer
   *   Gets pre-acting player name
   *
   *   @param  str playerName
   *   @return str pre-playerName
   */
  prePlayer(playerName) {
    const index = this.betTurn.indexOf(playerName);
    return index > 0 ? this.betTurn[index - 1] : this.betTurn[this.betTurn.length - 1];
  }

  /*
   * actionCandidates
   *   @param  {String} playerName
   *   @return {Array} actions
   */
  actionCandidates(playerName) {
    let actions;
    const action = this.players_[playerName].action;
    const preAction = this.players_[this.prePlayer(playerName)].action;
    if (action === null && (preAction === null || preAction === 'check'))
      actions = ['raise', 'check'];
    else if (preAction === 'raise')
      actions = ['raise', 'call', 'fold'];
    else
      return [];
    if (this.getMaxRaise() === 0)
      return actions.filter((v) => v !== 'raise');
    return actions;
  }

  /*
   * bet
   *   Checks bet
   *   @TODO for multi-player (decide 'fold' rule) & Error (now, return true)
   *
   *   @param  {String}  playerName
   *   @param  {String}  action
   *   @param  {Number}  tip
   *   @return {Boolean} - true: go to next bet, false: end
   */
  bet(playerName, action, tip = 0) {
    const actions = this.actionCandidates(playerName);
    if (!actions.includes(action))
      action = actions[0];

    const player = this.players_[playerName];
    const prePlayer = this.players_[this.prePlayer(playerName)];
    player.action = action;
    if (action === 'raise' && tip > 0 && tip <= this.getMaxRaise()) {
      player.hasTips -= (prePlayer.betTips - player.betTips) + tip;
      player.betTips = prePlayer.betTips + tip;
    } else if (action === 'call') {
      player.hasTips -= prePlayer.betTips - player.betTips;
      player.betTips = prePlayer.betTips;
      return false;
    } else if (action === 'fold' || (action === 'check' && prePlayer.action === 'check')) {
      return false;
    }
    return true;
  }

  getMaxRaise() {
    let totalTips = 0;
    const candidates = [];
    for (const name of this.betTurn) {
      totalTips += this.players_[name].betTips;
      candidates.push(this.players_[name].hasTips);
    }
    candidates.push(Math.floor(totalTips / this.betTurn.length));
    return Math.min.apply(null, candidates);
  }

  /**
   * judge
   *   Compares their Poker rank.
   *   If both of ranks are the same, compare a highest number of the hand.
   *   Ace(1) is highest. Two(2) is lowest.
   *   If they are the same, draw. (Suit and the Second Number are not considered.)
   *   @TODO random[rankCandidates.length]
   *
   * @return {Object} {winner: PlayerName, rank: rankName, cards: cards} - round winner
   **/
  judge() {
    const result = {rank: {}, cards: {}, winner: ''};
    let maxPoint = 0;
    for (const name of this.betTurn) {
      let player = {rank: null, numbers: [], suit: null, point: 0};
      const rankCandidates = this.getCombinations_(this.field[name]); // combCandidates, ifの上へ
      for (let i = 0; i < rankCandidates.length; i++) {
        // @todo suitの余りがあるのか確認
        let suit = null;
        const numbers = rankCandidates[i];
        let {name: rank, highCardPoint: point} = this.rankByNumbers_(numbers);
        if (rank === 'Straight' ||
          rank === 'HighCard' ||
          rank === 'RoyalStraight') {
          if (suit = this.getFlashSuit_(numbers)) {
            rank = rank === 'HighCard' ? 'Flush' : `${rank  }Flush`;
          }
        }
        point += RANK_POINTS[rank];
        if (point > player.point) {
          player.rank = rank;
          player.point = point;
          player.numbers = numbers;
          player.suit = suit;
        }
      }
      result.rank[name] = player.rank;
      result.cards[name] = {numbers: player.numbers, suit: player.suit};
      if (maxPoint <= player.point) {
        maxPoint = player.point;
        result.winner = name;
      }
    }
    // {cards: result.cards, overlap: result.disaster} = this.useCard_(result.cards);
    return result;
  }

  getTip(winner, disaster) {
    let totalTip = 0;
    this.betTurn.forEach(name => {
      totalTip += this.players_[name].betTips;
      this.players_[name].betTips = 0;
    });
    this.players_[winner].hasTips += totalTip; // @todo 呼吸で減るロジックを考慮し分離？
  }

  nextRound() {
    this.round++;
    this.field = {};
    this.betTurn.push(this.betTurn.shift()); // changeBetTurn
  }

  /*
   * getCombinations_
   *   Returns an array of five numbers to be the arguement number by summing them.
   *
   * @param  {Number} num
   * @return {Array}  combinations
   */
  getCombinations_(num) {
    const combinations = [];
    if (num > 5 && num < 65) {
      for (let a = 1; a < num / 5; a++) {
        const max2 = num - a;
        for (let b = a; b <= max2 / 4; b++) {
          const max3 = max2 - b;
          for (let c = b; c <= max3 / 3; c++) {
            const max4 = max3 - c;
            for (let d = c; d <= max4 / 2; d++) {
              const e = max4 - d;
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
    const rank = {highCardPoint: 0, name: null};
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
          for (const n in pairs) {
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
          for (const n in pairs) {
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
          for (const n in pairs) {
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

  /*
   * getFlashSuit_
   *   Finds an available suit.(if deckNum is 1)
   *
   *   @param  arr numbers [int,int,int,int,int]
   *   @return str suit or null
   */
  getFlashSuit_(numbers) {
    let setSuit;
    if (!Object.keys(SUITS).some(suit => {
      setSuit = SUITS[suit];
      return numbers.every(number => this.remainingCards[number].indexOf(setSuit) > -1);
    }, this)) {
      setSuit = null;
    }
    return setSuit;
  }

  /*
   * isStraight_
   *   @param  arr numbers [int,int,int,int,int]
   *   @return boolean
   */
  isStraight_(numbers) {
    return numbers.every((e, i, self) => e + 1 === self[i + 1] || i+1 === self.length);
  }

  /*
   * isRoyalStraight_
   *   @param  arr numbers [int,int,int,int,int]
   *   @return boolean
   */
  isRoyalStraight_(numbers) {
    return numbers.toString() === [1, 10, 11, 12, 13].toString();
  }

  /*
   * useCard_
   *   Reduces card from this.remainingCards and sets a suit if the suit is undefined.
   *
   * @param {Object} card - cardオブジェクト
   * @retrun {Object} card - cardオブジェクト
   */
  useCard_(card) {
    if (typeof card.suit === 'undefined') {
      card.suit = SUITS[this.remainingCards[card.number].shift()];
    } else {
      const remainingSuits = this.remainingCards[card.number];
      remainingSuits.splice(remainingSuits.indexOf(card.suit), 1);
    }
    return cards;
  }

}
