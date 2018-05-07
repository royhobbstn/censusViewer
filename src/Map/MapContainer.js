// this is a container component

import { connect } from 'react-redux';
import Map from './Map';

import { thunkUpdateClusters, thunkChangeMouseover } from '../_Redux/thunks/t_map.js';

import { addToTilesAlreadyRequested } from '../_Redux/actions/a_map.js';

const mapStateToProps = state => {
  return {
    polygon_stops: state.map.polygon_stops,
    source_geography: state.map.source_geography,
    source_dataset: state.map.source_dataset,
    tiles_already_requested: state.map.tiles_already_requested
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateClusters: (pole, current_zoom, current_bounds) => {
      dispatch(thunkUpdateClusters(pole, current_zoom, current_bounds));
    },
    updateMouseover: (geoid, name) => {
      dispatch(thunkChangeMouseover(geoid, name));
    },
    addToRequested: (urls) => {
      dispatch(addToTilesAlreadyRequested(urls));
    }
  };
};

const MapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default MapContainer;
