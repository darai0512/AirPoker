var React = require('react');

export default React.createClass({
  _change: function(e) {
    e.preventDefault();
  },
  _handleSubmit: function(e) {
    e.preventDefault();
    let tip = this.props.children === 'raise' ? Number(this._raise.value) : 0;
    this.props.bet(this.props.children, tip);
  },
  render: function() {
    if (this.props.children === 'raise') {
      const raiseOption = [];
      for (let i = 1; i <= this.props.maxRaise; ++i) {
        raiseOption.push(<option value={i} key={'raise' + i}>{i}</option>);
      }
      return (
        <span>
          <select
            ref={tip => this._raise = tip}
            value={this.props.maxRaise}
            onChange={this._change}>
            {raiseOption}
          </select>
          <button
            className="button"
            type="button"
            onClick={this._handleSubmit}>{this.props.children}</button>
        </span>
      );
    }
    return (
        <button
          className="button"
          type="button"
          onClick={this._handleSubmit}>{this.props.children}</button>
    );
  }
});
