// this is a container component

import { connect } from 'react-redux';
import ButtonSet from './ButtonSet.js';

import { thunkClearWorkers } from '../_Redux/thunks/t_map.js';
import { updateDataset, updateGeography, updateTheme } from '../_Redux/actions/a_buttonset.js';

const mapStateToProps = state => {
  return {
    selected_attr: state.map.selected_attr,
    source_dataset: state.map.source_dataset,
    source_geography: state.map.source_geography
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleDatasetChange: selectedOption => {
      dispatch(thunkClearWorkers());
      dispatch(updateDataset(selectedOption.value));
    },
    handleGeographyChange: selectedOption => {
      dispatch(updateGeography(selectedOption.value));
    },
    handleThemeChange: selectedOption => {
      dispatch(updateTheme(selectedOption.value));
    },
  };
};

const ButtonSetContainer = connect(mapStateToProps, mapDispatchToProps)(ButtonSet);

export default ButtonSetContainer;
