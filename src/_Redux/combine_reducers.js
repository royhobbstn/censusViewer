import { combineReducers } from 'redux';
import map from './reducers/map';
import buttonset from './reducers/buttonset';

const Store = combineReducers({
    map,
    buttonset
});

export default Store;
