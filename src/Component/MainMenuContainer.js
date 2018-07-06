// this is a container component

import { connect } from 'react-redux';
import MainMenu from './MainMenu.js';


import { thunkClearWorkers } from '../Redux/thunks.js';
import { updateDataset, updateGeography, updateTheme } from '../Redux/actions.js';

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
      dispatch(thunkClearWorkers());
      dispatch(updateGeography(selectedOption.value));
    },
    handleThemeChange: selectedOption => {
      dispatch(thunkClearWorkers());
      dispatch(updateTheme(selectedOption.value));
    }
  };
};

const MainMenuContainer = connect(mapStateToProps, mapDispatchToProps)(MainMenu);

export default MainMenuContainer;
