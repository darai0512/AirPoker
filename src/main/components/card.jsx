var React = require('react');

export default React.createClass({
  _handleSubmit: function(e) {
    e.preventDefault();
    this.props.setCard(this.props.card);
  },
  render: function() {
    let cardNode = () => {
      if (this.props.phase !== 'card' || this.props.card === '?') {
        return (
          <button className="card" disabled>{this.props.card} </button>
        );
      } else {
        return (
          <button className="card able" type="button" onClick={this._handleSubmit}>{this.props.card}</button>
        );
      }
    };
    return cardNode();
  }
});
