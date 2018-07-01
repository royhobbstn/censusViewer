import React, { Component } from 'react';
import './App.css';

import MapContainer from './Map/MapContainer.js';
import ButtonSetContainer from './ButtonSet/ButtonSetContainer.js';

class App extends Component {
  render() {
    return (
      <div>
        <MapContainer />
        <ButtonSetContainer />
      </div>
    );
  }
}

export default App;
