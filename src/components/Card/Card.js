import React from 'react';

class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleSubmit(e) {
    this.props.setCard(this.props.card);
  }

  render() {
    if (this.props.phase !== 'card' || this.props.card === '?') {
      return (
        <button className="card" disabled>{this.props.card}</button>
      );
    } 
    return (
      <button className="card able" type="button" onClick={this._handleSubmit.bind(this)}>{this.props.card}</button>
    );
  }
}

export default Card;
