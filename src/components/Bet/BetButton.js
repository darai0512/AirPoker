import React from 'react';
import {RaisedButton} from 'material-ui';
import {style} from './BetButtonStyle';

class BetButton extends React.Component {
  constructor(props) {
    super(props);
  }

  _handleSubmit(e) {
    const action = e.target.innerText;
    this.props.bet(action);
  }

  render() {
    return (
      <RaisedButton label={this.props.label} style={style} onTouchTap={this._handleSubmit.bind(this)} />
    );
  }
}

export default BetButton;
