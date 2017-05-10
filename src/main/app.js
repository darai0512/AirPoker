const React = require('react');
import AirPoker from './logic/airpoker.js';
import Model from './logic/model/darai0512.js';
import AirPokerUi from './components/airpoker.jsx';

let model = new Model();
const players = ['You', model.name];
let airPoker = new AirPoker(players);

require('react-dom').render(
  <AirPokerUi airPoker={airPoker} model={model} />,
  document.getElementById('container')
);
