// this is a container component

import { connect } from 'react-redux';
import ZoomMessage from './ZoomMessage.js';

const mapStateToProps = state => {
  return {
    map_zoom: state.map.map_zoom,
    source_geography: state.map.source_geography
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const ZoomMessageContainer = connect(mapStateToProps, mapDispatchToProps)(ZoomMessage);

export default ZoomMessageContainer;
