const React = require('react');

class Bet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {raiseValue: this.props.maxRaise};
    this.submitFlag = false;
  }

  _handleChange(e) {
    this.setState({raiseValue: e.target.value});
  }

  _handleSubmit(e) {
    e.preventDefault();
    const action = e.target.innerText;
    const tip = Number(this.state.raiseValue);
    this.props.bet(action, tip);
    this.submitFlag = true;
  }

  render() {
    // @TODO raiseの度にaction分renderされるのでraiseを切り分ける
    if (this.props.children === 'raise') {
      const options = [];
      const max = this.props.maxRaise;
      for (let i = 1; i <= max; ++i)
        options.push(<option value={i} key={'raise' + i}>{i}</option>);
      let value = this.state.raiseValue;
      if (this.submitFlag) {
        value = max;
        this.submitFlag = false;
      }

      return (
        <span>
          <select
            // @TODO valueだとstateを通じて都度renderさせる必要があり無駄
            // defaultValueだとmaxに更新されずoption.selectedだとWarning
            value={value}
            onChange={this._handleChange.bind(this)}
          >
            {options}
          </select>
          <button
            className="button"
            type="button"
            onClick={this._handleSubmit.bind(this)}>raise</button>
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
}

export default Bet;
