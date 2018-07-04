import React, { Component } from 'react';
import './App.css';

import MapContainer from './Component/MapContainer.js';
import ButtonSetContainer from './Component/ButtonSetContainer.js';
import ZoomMessageContainer from './Component/ZoomMessageContainer.js';

class App extends Component {
  render() {
    return (
      <div>
        <MapContainer />
        <ButtonSetContainer />
        <ZoomMessageContainer />
      </div>
    );
  }
}

export default App;
