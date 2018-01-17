// this is a container component

import { connect } from 'react-redux';
import Map from './Map';

import { thunkUpdateGeoids, thunkChangeMouseover } from '../_Redux/thunks/t_map.js';

const mapStateToProps = state => {
  return {
    polygon_stops: state.map.polygon_stops,
    source_geography: state.map.source_geography,
    source_dataset: state.map.source_dataset
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateGeoids: geoids => {
      dispatch(thunkUpdateGeoids(geoids));
    },
    updateMouseover: (geoid, name) => {
      dispatch(thunkChangeMouseover(geoid, name));
    }
  };
};

const MapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default MapContainer;
