import React from 'react';
import ReactDOM from 'react-dom';

import MainMenuContainer from './Component/MainMenuContainer.js';
import MapContainer from './Component/MapContainer.js';
import ZoomMessageContainer from './Component/ZoomMessageContainer.js';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Store from './Redux/combine_reducers';

import 'semantic-ui-css/semantic.min.css';
import './index.css';


export const store = createStore(
  Store,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store}>
      <React.Fragment>
      <MapContainer /> 
      <MainMenuContainer />
      <ZoomMessageContainer />
      </React.Fragment>
  </Provider>,
  document.getElementById('root')
);
