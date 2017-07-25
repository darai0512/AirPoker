import React from 'react';
import Card from '../Card/Card';

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: 'sum', // 'trump'
    };
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const handleHover = (e, i, v) => this.setState({display: 'trump'});
    if (this.state.display === 'sum') {
      this.props.hand.map((card, i) => (
         <Card card={card} phase={this.props.phase} setCard={this.setCard.bind(this)} key={`${i  }-${  card}`} />
      ));
    } 
    return (
      <button className="card able" type="button" onMouseOver={this._handleSubmit.bind(this)}>{this.props.card}</button>
    );
  }
}

export default Hand;
