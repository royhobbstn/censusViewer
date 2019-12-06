// this is a container component

import { connect } from 'react-redux';
import Info from './Info.js';

const mapStateToProps = state => {
  return {
    mouseover_statistic: state.map.mouseover_statistic,
    mouseover_label: state.map.mouseover_label,
    mouseover_moe: state.map.mouseover_moe,
    source_dataset: state.map.source_dataset,
    selected_attr: state.map.selected_attr,
  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

const InfoContainer = connect(mapStateToProps, mapDispatchToProps)(Info);

export default InfoContainer;
