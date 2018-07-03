// this is a container component

import { connect } from 'react-redux';
import Map from './Map';

import { thunkUpdateClusters, thunkChangeMouseover, thunkRemoveLayers } from '../Redux/thunks.js';

import { addToTilesAlreadyRequested } from '../Redux/actions.js';

const mapStateToProps = state => {
  return {
    source_geography: state.map.source_geography,
    source_dataset: state.map.source_dataset,
    tiles_already_requested: state.map.tiles_already_requested,
    active_layer_names: state.map.active_layer_names,
    selected_attr: state.map.selected_attr,
    mouseover_statistic: state.map.mouseover_statistic,
    mouseover_label: state.map.mouseover_label,
    mouseover_moe: state.map.mouseover_moe,
    mouseover_coords: state.map.mouseover_coords
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateClusters: (pole, current_zoom, current_bounds) => {
      dispatch(thunkUpdateClusters(pole, current_zoom, current_bounds));
    },
    updateMouseover: (geoid, name, coords) => {
      dispatch(thunkChangeMouseover(geoid, name, coords));
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
