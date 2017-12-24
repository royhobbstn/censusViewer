// this is a container component

import { connect } from 'react-redux';
import Mouseover from './Mouseover.js';

const mapStateToProps = state => {
    return {
        mouseover_statistic: state.map.mouseover_statistic,
        mouseover_moe: state.map.mouseover_moe,
        mouseover_label: state.map.mouseover_label
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

const MouseoverContainer = connect(mapStateToProps, mapDispatchToProps)(Mouseover);

export default MouseoverContainer;
