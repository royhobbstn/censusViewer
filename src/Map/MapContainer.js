// this is a container component

import { connect } from 'react-redux';
import Map from './Map';

import { thunkUpdateClusters, thunkChangeMouseover, thunkRemoveLayers } from '../_Redux/thunks/t_map.js';

import { addToTilesAlreadyRequested } from '../_Redux/actions/a_map.js';

const mapStateToProps = state => {
  return {
    source_geography: state.map.source_geography,
    source_dataset: state.map.source_dataset,
    tiles_already_requested: state.map.tiles_already_requested,
    active_layer_names: state.map.active_layer_names
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
    },
    clearActiveLayers: () => {
      dispatch(thunkRemoveLayers());
    }
  };
};

const MapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default MapContainer;
