// this is a container component

import { connect } from 'react-redux';
import ButtonSet from './ButtonSet.js';

import { updateDataset } from '../_Redux/actions/buttonset.js';

const mapStateToProps = state => {
  return {
    selected_attr: state.buttonset.selected_attr
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleChange: selectedOption => {
      console.log(selectedOption);
      dispatch(updateDataset(selectedOption.value));
    }

  };
};

const ButtonSetContainer = connect(mapStateToProps, mapDispatchToProps)(ButtonSet);

export default ButtonSetContainer;
