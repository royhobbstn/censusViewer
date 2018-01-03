// reducer

import { configuration } from '../../_Config_JSON/configuration.mjs';

const default_stops = {};


const default_state = {
  polygon_stops: default_stops,
  source_geography: configuration.startup.source_geography,
  source_dataset: configuration.startup.source_dataset,
  selected_attr: configuration.startup.selected_attr,
  is_busy: false,
  mouseover_statistic: undefined,
  mouseover_moe: undefined,
  mouseover_label: undefined
};

const map = (
  state = default_state,
  action
) => {
  switch (action.type) {
    case 'UPDATE_POLYGON_STYLE':
      return Object.assign({}, state, {
        polygon_stops: Object.assign({}, action.stops),
        is_busy: false
      });
    case 'UPDATE_DATASET':
      console.log('updating dataset');
      return Object.assign({}, state, {
        source_dataset: action.dataset,
        polygon_stops: {},
        mouseover_statistic: undefined,
        mouseover_moe: undefined,
        mouseover_label: undefined
      });
    case 'UPDATE_GEOGRAPHY':
      console.log('updating geography');
      return Object.assign({}, state, {
        source_geography: action.geography,
        polygon_stops: {},
        mouseover_statistic: undefined,
        mouseover_moe: undefined,
        mouseover_label: undefined
      });
    case 'UPDATE_THEME':
      console.log('updating theme');
      return Object.assign({}, state, {
        selected_attr: action.theme,
        polygon_stops: {},
        mouseover_statistic: undefined,
        mouseover_moe: undefined,
        mouseover_label: undefined
      });
    case 'UPDATE_MOUSEOVER':
      return Object.assign({}, state, {
        mouseover_statistic: action.mouseover_statistic,
        mouseover_moe: action.mouseover_moe,
        mouseover_label: action.mouseover_label
      });
    case 'BUSY_LOADING_STYLE':
      return Object.assign({}, state, { is_busy: true });
    default:
      return state;
  }
};

export default map;
