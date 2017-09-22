import React from 'react';
import Hand from '../Hand/Hand';
import BetButton from '../Bet/BetButton';
import Raise from '../Bet/Raise';
import Bubble from '../Bubble/Bubble';

// const airLostTime = 5;

// @TOOD for multi-player
export default class App extends React.Component {
  constructor(props) {
    super(props);
    const {airPoker} = props;
    this.state = {
      hand: {sum: airPoker.findCandidates('You'), trump: []},
      remainingAir: airPoker.getRemainingAir(),
      round: airPoker.round,
      field: airPoker.field,
      phase: 'card', // or 'bet' or 'gameset' (or 'enter')
      bubbleNum: 25,
      result: {winner: null, rank: null, cards: null} // round winner or game winner
    };
  }

  componentDidMount() {
  /*
    this.timerID = setInterval(() => {
      const {remainingAir} = this.state;
      for (const name of Object.keys(remainingAir))
        remainingAir -= 1;
      this.setState({remainingAir});
    }, airLostTime * 1000);
   */ 
  }

  componentWillUnmount() {
    // clearInterval(this.timerID);
  }

  componentWillUpdate(nextProps, nextState) {
    const {airPoker} = this.props;
    if (this.state.phase === 'card' && nextState.phase === 'bet') {
      if (airPoker.initBet() !== 'You')
        this.npcBet(null, 0);
    }
  }

  navigate() {
    const {model, airPoker} = this.props;
    if(this.state.phase === 'card') {
      let guideWinner = '';
      if (this.state.result.winner != null) {
        guideWinner = `Round${this.state.round - 1}: You[${ 
          this.state.result.rank.You}] vs NPC[${ 
          this.state.result.rank[model.name]}] => ${this.state.result.winner} win!`;
      }
      return (
        <div>
          <p>{guideWinner}</p>
          <p>{`Round${  this.state.round}`}</p>
          <p>Select a card or Check <a href="https://github.com/darai0512/AirPoker/wiki/Rule_japanese" target="_blank">RULE</a></p>
        </div>
      );
    } else if (this.state.phase === 'bet') {
      const maxRaise = airPoker.getMaxRaise();
      const s = airPoker.getStatus();
      const npcBetAir = s[model.name].betAir;
      const betNode = airPoker.actionCandidates('You').map((action) => {
        if (action === 'raise') {
          return (
            <Raise bet={this.bet.bind(this)} key={action} maxRaise={maxRaise} npcBet={npcBetAir} />
          );
        }
        return (
          <BetButton bet={this.bet.bind(this)} key={action} label={action} />
        );
      });
      return (
        <div>
          <div className="status">NPC's Bet: {npcBetAir}, Action: {s[model.name].action || " -"}</div>
          {betNode}
          <div className="status">Your Bet: {s.You.betAir}, Action: {s.You.action || " -"}</div>
        </div>
      );
    } else if (this.state.phase === 'gameset') {
      let msg;
      if (this.state.result.winner === 'You')
        msg = "You win! You're alive";
      else
        msg = "Game Over, you're drowned...";
      return (<p className="gameset">{msg}</p>);
    }
  }

  setCard(card) {
    const {airPoker, model} = this.props;
    airPoker.setField('You', card);
    const modelCard = model.setCard(airPoker.findCandidates(model.name), airPoker.remainingCards);
    airPoker.setField(model.name, modelCard);

    this.setState({
      field: airPoker.field,
      hand: {
        sum: airPoker.findCandidates('You'),
        trump: airPoker.getPokerCards(airPoker.field.You).cards
      },
      phase: 'bet',
    });
  }

  npcBet(oAction, oBetTips) {
    const {airPoker, model} = this.props;
    const remainingAir = airPoker.getRemainingAir();
    const {action, tip} = model.bet(
      this.state.field.You
      ,oAction
      ,oBetTips
      ,remainingAir.You
      ,remainingAir[model.name]
    );
    return airPoker.bet(model.name, action, tip);
  }

  bet(action, air = 0) {
    const {airPoker, model} = this.props;
    let nextBet = airPoker.bet('You', action, air);
    if (nextBet)
      nextBet = this.npcBet(action, air);
    if (nextBet) {
      this.setState({
        remainingAir: airPoker.getRemainingAir()
      });
    } else {
      const result = airPoker.judge();
      // result.cards[name].numbersがカード
      airPoker.getTip(result.winner);
      const remainingAir = airPoker.getRemainingAir();
      let phase = 'card';
      if (this.state.round === 5) {
        phase = 'gameset';
        result.winner = remainingAir.You < remainingAir[model.name] ?
          model.name : 'You'; 
      } else {
        for (const name of Object.keys(remainingAir)) {
          if (remainingAir[name] <= this.state.round + 1) {
            phase = 'gameset';
            result.winner = name === 'You' ? model.name : 'You'; 
          }
        }
      }
      if (phase === 'gameset') {
        // clearInterval(this.timerID);
      } else
        airPoker.nextRound();
      this.setState({
        result,
        field: airPoker.field,
        remainingAir,
        phase,
        bubbleNum: phase === 'gameset' ? 100 : this.state.bubbleNum,
        round: airPoker.round
      });
    }
  }

  render() {
    const {model, airPoker} = this.props;
    //  modelがrequireできる関数を提供, getPokerCardsを公開
    const bubbleNode = [];
    for (let i=0; i < this.state.bubbleNum; i++)
      bubbleNode.push(<Bubble key={`bubble-${  i}`} />);
    return (
      <div>
        <div className="status"><span className="npc">NPC</span> Air: {this.state.remainingAir[model.name]}</div>
        <Hand phase={this.state.phase} hand={this.state.hand} setCard={this.setCard.bind(this)} player='npc' key='npc-hand' />
        <button className={this.state.phase === 'card' ? "field" : "field card"} disabled>{this.state.field[model.name]}</button>
        <div className="guide">{this.navigate()}</div>
        <button className={this.state.phase === 'card' ? "field" : "field card"} disabled>{this.state.field.You}</button>
        <Hand phase={this.state.phase} hand={this.state.hand} setCard={this.setCard.bind(this)} player='you' key='you-hand' />
        <div className="status"><span className="you">You</span> Air: {this.state.remainingAir.You}</div>
        {bubbleNode}
      </div>
    );
  }
}
