// this is a container component

import { connect } from 'react-redux';
import Map from './Map';

const mapStateToProps = state => {
  return {
    polygon_stops: state.map.polygon_stops,
    polygon_source: state.map.polygon_source
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const MapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default MapContainer;
