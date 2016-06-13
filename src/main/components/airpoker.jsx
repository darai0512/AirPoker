var React = require('react');
import Card from './card.jsx';
import Bet from './bet.jsx';
import Bubble from './bubble.jsx';

export default React.createClass({
  getInitialState: function() {
    const {airPoker} = this.props;
    return {
      hand: airPoker.findCandidates('You'),
      status: airPoker.getStatus(),
      round: airPoker.round,
      field: airPoker.field,
      phase: 'card', // or 'bet' or 'result' or 'gameset' (or 'enter')
      bubbleNum: 25,
      result: {winner: null, rank: null, cards: null} // round winner or game winner
    };
  },
  componentDidMount() {
    // timer
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    Object.keys(nextState.status).forEach((player) => {
      if (nextState.status[player].remainingAir < 0) { // @todo 多人数対応
        nextState.phase = 'gameset';
        nextState.bubbleNum = 50;
        nextState.result.winner = this.props.airPoker.prePlayer(player);
      }
    });
    return true;
  },
  navigate: function() {
    const {model, airPoker} = this.props;
    if(this.state.phase === 'card') {
      let guideWinner = '';
      if (this.state.result.winner != null) {
        guideWinner = 'Round' + --this.state.round + ': Your Rank is ' +
          this.state.result.rank.You + ', NPC Rank is ' +
          this.state.result.rank[model.name];
      }
      return (
        <div>
          <p>{guideWinner}</p>
          <p>{'Round' + this.state.round}</p>
          <p>Select a card or Check <a href="https://github.com/darai0512/AirPoker/wiki/Game-Rule" target="_blank">RULE</a></p>
        </div>
      );
    } else if (this.state.phase === 'bet') {
      let betNode = airPoker.actionCandidates('You').map(function(action) {
        return (
          <Bet bet={this.bet} key={action} maxRaise={airPoker.getMaxRaise()}>{action}</Bet>
        );
      }, this);
      return (
        <div>
          <div className="status">NPC's Bet: {this.state.status[model.name].betAir}, Action: {this.state.status[model.name].action || " -"}</div>
          {betNode}
          <div className="status">Your Bet: {this.state.status['You'].betAir}, Action: {this.state.status['You'].action || " -"}</div>
        </div>
      );
    } else if (this.state.phase === 'result') {

    } else if (this.state.phase === 'gameset' &&
              this.state.result.winner === 'You') {
      return (<p className="gameset">You win! You're alive</p>);
    } else if (this.state.phase === 'gameset') {
      return (<p className="gameset">Game Over, you're drowned...</p>);
    }
  },
  setCard: function(card) {
    const {airPoker, model} = this.props;
    airPoker.setField('You', card, true);
    let modelCard = model.setCard(airPoker.findCandidates(model.name), airPoker.remainingCards);
    airPoker.setField(model.name, modelCard, model.maxRankFlag);

    // for bet phase
    airPoker.initBet();
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
      field: airPoker.field,
      hand: airPoker.findCandidates('You'),
      phase: 'bet',
      status: airPoker.getStatus()
    });
  },
  bet: function(action, air) {
    const airPoker = this.props.airPoker;
    let nextBet = false;
    if (airPoker.bet('You', action, air)) {
      let nextNPC = airPoker.betTurn.indexOf('You')+1 === airPoker.betTurn.length ? airPoker.betTurn[0] : airPoker.betTurn[airPoker.betTurn.indexOf('You')+1];
      let status = airPoker.getStatus();
      let {action, tip} = this.props.model.bet(airPoker.field['You'] // @todo multi player?
          ,action
          ,status['You'].betAir
          ,status['You'].remainingAir
          ,status[nextNPC].remainingAir );
      if (!airPoker.actionCandidates(nextNPC).includes(action)) {
        action = 'fold';
      }
      nextBet = airPoker.bet(nextNPC, action, tip);
    }
    if (nextBet) {
      this.setState({
        status: airPoker.getStatus()
      });
    } else {
      let roundResult = airPoker.judge();
      airPoker.getTip(roundResult.winner);
      airPoker.nextRound();
      this.setState({
        result: roundResult,
        field: airPoker.field,
        status: airPoker.getStatus(),
        phase: 'card',
        round: airPoker.round
      });
    }
  },
  render: function() {
    const {model, airPoker} = this.props;
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
    let bubbleNode = [];
    for (let i=0; i < this.state.bubbleNum; i++) {
      bubbleNode.push(<Bubble key={'bubble-' + i} />);
    }
    return (
      <div>
        <div className="status"><span className="npc">NPC</span> Air: {this.state.status[model.name].remainingAir}</div>
        <div className="hand npc">{npcCardNode}</div>
        <button className={this.state.phase === 'card' ? "field" : "field card"} disabled>{this.state.field[model.name]}</button>
          <div className="guide">{this.navigate()}</div>
        <button className={this.state.phase === 'card' ? "field" : "field card"} disabled>{this.state.field['You']}</button>
        <div className="hand you">{yourCardNode}</div>
        <div className="status"><span className="you">You</span> Air: {this.state.status['You'].remainingAir}</div>
        {bubbleNode}
      </div>
    );
  }
});
