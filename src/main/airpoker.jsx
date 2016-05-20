// UI
var React = require('react');
var ReactDOM = require('react-dom');
import AirPoker from './airpoker.js';
import Model from './model/darai0512.js'; //require('./model/darai0512.js');

let model = new Model();
const players = ['You', model.name];
let airPoker = new AirPoker(players);

var AirPokerUi = React.createClass({
  getInitialState: function() {
    const airPoker = this.props.airPoker;
    return {
      hand: airPoker.findCandidates('You'),
      status: airPoker.getStatus(),
      round: airPoker.round,
      field: airPoker.field,
      phase: 'card', // or 'rank' or 'bet' or 'end' (or 'enter')
      result: {winner: null, rank: null, cards: null} // round winner or game winner
    };
  },
  componentDidMount() {
    // timer
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    Object.keys(nextState.status).forEach((player) => {
      if (nextState.status[player].remainingAir < 0) { // @todo 多人数対応
        nextState.phase = 'end';
        nextState.result.winner = this.props.airPoker.prePlayer(player);
      }
    });
    return true;
  },
  setCard: function(card) {
    const airPoker = this.props.airPoker;
    const model = this.props.model;
    airPoker.setField('You', card);
    airPoker.setField(model.name, model.setCard(airPoker.findCandidates(model.name), airPoker.remainingCards));
    this.setState({
      field: airPoker.field,
      hand: airPoker.findCandidates('You'),
      phase: 'rank'
    });
  },
  rankFlag: function(rankFlag) {
    const airPoker = this.props.airPoker;
    airPoker.setRankFlag('You', rankFlag);
    airPoker.setRankFlag(this.props.model.name, this.props.model.rankFlag);
    // exec first betting
    airPoker.preBet();
    for (let i=0;i < airPoker.betTurn.length;i++) {
      let betPlayer = airPoker.betTurn[i];
      if (betPlayer === 'You') {
        break;
      } else {
        let prePlayer = airPoker.prePlayer(betPlayer);
        let status = airPoker.getStatus();
        let bet = this.props.model.bet(airPoker.field[prePlayer]
                                      ,status[prePlayer].action
                                      ,status[prePlayer].betAir
                                      ,status[prePlayer].remainingAir
                                      ,status[betPlayer].remainingAir );
        if (!airPoker.actionCandidates(betPlayer).includes(bet.action)) {
          bet.action = 'check';
        }
        airPoker.bet(betPlayer, bet.action, bet.tip);
      }
    }
    this.setState({
      phase: 'bet',
      status: airPoker.getStatus()
    });
  },
  bet: function(action, air) { // about only 'Your' bet
    const airPoker = this.props.airPoker;
    if (action ==='raise') { air = airPoker.getMaxRaise(); } //@todo 4 raiseでのtip数を選択できるように
    let nextBet = false;
    if (airPoker.bet('You', action, air)) {
      let nextNPC = airPoker.betTurn.indexOf('You')+1 === airPoker.betTurn.length ? airPoker.betTurn[0] : airPoker.betTurn[airPoker.betTurn.indexOf('You')+1];
      let status = airPoker.getStatus();
      let bet = this.props.model.bet(airPoker.field['You'] // @todo multi player?
          ,action
          ,status['You'].betAir
          ,status['You'].remainingAir
          ,status[nextNPC].remainingAir );
      if (!airPoker.actionCandidates(nextNPC).includes(bet.action)) {
        bet.action = 'fold';
      }
      nextBet = airPoker.bet(nextNPC, bet.action, bet.tip);
    }
    if (nextBet) {
      this.setState({
        status: airPoker.getStatus()
      });
    } else {
      this.setState({
        result: airPoker.judge(),
        field: airPoker.field,
        status: airPoker.getStatus(),
        phase: 'card',
        round: airPoker.round
      });
    }
  },
  render: function() {
    const model = this.props.model;
    let yourCardNode = this.state.hand.map(function(card, i) { // @todo 要Object.assign([], this.state.hand)？/cardはchildrenに
      return (
        <Card card={card} phase={this.state.phase} setCard={this.setCard} key={i + '-' + card}/>
      );
    }, this);
    let npcCardNode = this.state.hand.map(function(card, i) {
      card = '?';
      return (
        <Card card={card} key={i + '-' + card}/>
      );
    }, this);
    let guideNode = () => {
      if(this.state.phase === 'card') {
        let guide = 'Select your card!';
        if (this.state.result.winner === 'You') {
          guide = 'Round' + --this.state.round + ': You Win! Rank=' + this.state.result.rank;
        } else if (this.state.result.winner != null) {
          guide = 'Round' + --this.state.round + ': You Lose...NPC Rank=' + this.state.result.rank;
        } else if (this.state.round > 1) {
          guide = 'Round' + --this.state.round + ': Draw';
        }
        return (
          <p>{guide}</p>
        );
      } else if (this.state.phase === 'rank') {
        return (
          <div className="rank">set&nbsp;
            <Rank rankFlag={this.rankFlag}>Max</Rank>
            <Rank rankFlag={this.rankFlag}>Missing</Rank>
          &nbsp;Rank</div>
        );
      } else if (this.state.phase === 'bet') {
        return this.props.airPoker.actionCandidates('You').map(function(action) {
          return (
            <Bet bet={this.bet} key={action}>{action}</Bet>
          );
        }, this);
      } else if (this.state.phase === 'end') {
        return (<p>Game Set! Winner: {this.state.result.winner}</p>);
      }
    };
    return (
      <div className="airPoker">
        <div className="description status npc">NPC remaining Air: {this.state.status[model.name].remainingAir}, Bet Air: {this.state.status[model.name].betAir}, Action: {this.state.status[model.name].action || " -"}</div>
        <div className="hand npc">{npcCardNode}</div>
        <button className={this.state.phase === 'card' ? "field" : "field card"} disabled>{this.state.field[model.name]}</button>
          <div className="description">{guideNode()}</div>
        <button className={this.state.phase === 'card' ? "field" : "field card"} disabled>{this.state.field['You']}</button>
        <div className="hand you">{yourCardNode}</div>
        <div className="description status you">Your remaining Air: {this.state.status['You'].remainingAir}, Bet Air: {this.state.status['You'].betAir}, Action: {this.state.status['You'].action || " -"}</div>
      </div>
    );
  }
});
var Card = React.createClass({
  getMaxRankCombination: function() {
  },
  setCard: function(e) {
    e.preventDefault();
    this.props.setCard(this.props.card);
  },
  render: function() {
    let cardNode = () => {
      if (this.props.phase != 'card' || this.props.card === '?') {
        return (
          <button className="card" disabled>{this.props.card} </button>
        );
      } else {
        return (
          <button className="card able" type="button" onClick={this.setCard} onMouseOver={this.getMaxRankCombination}>{this.props.card}</button>
        );
      }
    };
    return cardNode();
  }
});
var Rank = React.createClass({
  rankFlag: function(e) {
    e.preventDefault();
    this.props.rankFlag(this.props.children == 'Max');
  },
  render: function() {
    return (
      <button className="rank button" type="button" onClick={this.rankFlag}>{this.props.children}</button>
    );
  }
});
var Bet = React.createClass({
  bet: function(e) {
    e.preventDefault();
    this.props.bet(this.props.children, 0); // @todo 4 raiseでのtip数を選択できるように
  },
  render: function() {                      
    return (
      <button className="bet button" type="button" onClick={this.bet}>{this.props.children}</button>
    );
  }
});
ReactDOM.render(
  <AirPokerUi airPoker={airPoker} model={model} />,
  document.getElementById('container')
);
