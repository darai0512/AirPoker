import React from 'react';

import AirPoker from './logic/AirPoker';
import Model from './logic/model/darai0512';
import App from './components/App/App';
// Material-UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

const model = new Model();
const players = ['You', model.name];
const airPoker = new AirPoker(players);

// for Material-UI
injectTapEventPlugin();
const muiTheme = getMuiTheme({
  palette : {
    primary1Color : '#f07800',
  },
});

require('react-dom').render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <App airPoker={airPoker} model={model} />
  </MuiThemeProvider>,
  document.getElementById('app')
);
