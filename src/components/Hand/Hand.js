import React from 'react';
import Card from '../Card/Card';

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'sum', // or trump
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.phase === 'card' && nextProps.phase === 'bet')
      this.setState({display: 'trump'});
    else if (this.props.phase === 'bet' && nextProps.phase === 'card')
      this.setState({display: 'sum'});
  }

  render() {
    let cardNode;
    let {hand, player, phase, setCard} = this.props;
    if (player === 'npc') {
      cardNode = hand.sum.map((_, i) => (
        <Card card='?' key={`${i}-?`} />
      ));
      return (
        <div className='hand npc'>
          {cardNode}
        </div>
      );
    } else if (this.state.display === 'sum' && phase === 'card') {
      cardNode = hand.sum.map((card, i) => (
        <Card card={card} phase={phase} setCard={setCard} key={`${i}-${card}`} />
      ));
      return (
        <div className='hand you'>
          {cardNode}
        </div>
      );
    } else { // phase: bet
      const mouseOver = (e) => this.setState({display: 'sum'});
      const mouseOut = (e) => this.setState({display: 'trump'});
      hand = this.state.display === 'sum' ? hand.sum : hand.trump;
      cardNode = hand.map((card, i) => (
        <Card card={card} phase={phase} key={`${i}-${card}`} />
      ));
      return (
        <div className='hand you' onMouseOver={mouseOver} onMouseOut={mouseOut}>
          {cardNode}
        </div>
      );
    }
  }
}

export default Hand;
