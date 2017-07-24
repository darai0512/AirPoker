import React from 'react';
import {RaisedButton, DropDownMenu, MenuItem} from 'material-ui';
import {style} from './BetButtonStyle';

class Raise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.maxRaise};
  }

  render() {
    const options = [];
    const max = this.props.maxRaise;
    for (let i = 1; i <= max; ++i)
      options.push(<MenuItem value={i} key={`raise${i}`} primaryText={`${i} Air`} />);

    const _handleChange = (e, index, value) => this.setState({value}); // = e.target.value
    const _handleSubmit = (e) => this.props.bet('raise', parseInt(this.state.value, 10));

    return (
      <span>
        <DropDownMenu maxHeight={300} value={this.state.value} onChange={_handleChange}>
          {options}
        </DropDownMenu>
        <RaisedButton label="RAISE" style={style} onTouchTap={_handleSubmit} backgroundColor="#ff4081" />
      </span>
    );
  }
}

export default Raise;
