// this is a container component

import { connect } from 'react-redux';
import ButtonSet from './ButtonSet.js';

import { clearButtonPress } from '../_Redux/actions/buttonset.js';
import { thunkButtonsetClick } from '../_Redux/thunks/buttonset.js';

const mapStateToProps = state => {
  return {
    selected_attr: state.buttonset.selected_attr
  };
};

const mapDispatchToProps = dispatch => {
  return {
    buttonClick: e => {
      const el = e.target.id;

      if (el === 'attr_empty') {
        dispatch(clearButtonPress());
      }
      else {
        // get geoids of all polygons on screen
        const features = window.map.queryRenderedFeatures({ layers: ['tiles-polygons'] });

        const geoids = features.map(d => {
          return d.properties.geoid;
        });

        dispatch(thunkButtonsetClick(el, geoids, el));
      }

    }

  };
};

const ButtonSetContainer = connect(mapStateToProps, mapDispatchToProps)(ButtonSet);

export default ButtonSetContainer;
