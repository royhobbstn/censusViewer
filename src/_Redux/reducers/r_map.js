// reducer

import { configuration } from '../../_Config_JSON/configuration.js';


const default_state = {
  busy_data: false,
  busy_moe: false,
  polygon_stops: {},
  cluster_done_list: [],
  moe_stops: {},
  moe_cluster_done_list: [],
  source_geography: configuration.startup.source_geography,
  source_dataset: configuration.startup.source_dataset,
  selected_attr: configuration.startup.selected_attr,
  mouseover_statistic: undefined,
  mouseover_label: undefined,
  mouseover_moe: undefined,
  tiles_already_requested: []
};

const map = (
  state = default_state,
  action
) => {
  switch (action.type) {
    case 'ADD_TO_REQUESTED_TILES_LIST':
      return Object.assign({}, state, { tiles_already_requested: [...state.tiles_already_requested, ...action.urls] });
    case 'BUSY_DATA':
      return Object.assign({}, state, { busy_data: true });
    case 'BUSY_MOE':
      return Object.assign({}, state, { busy_moe: true });
    case 'UNBUSY_DATA':
      return Object.assign({}, state, { busy_data: false });
    case 'UNBUSY_MOE':
      return Object.assign({}, state, { busy_moe: false });
    case 'UPDATE_POLYGON_STYLE':
      console.log('reducer draw');
      const t = window.performance.now();
      const updated_cluster_done_list = [...state.cluster_done_list, ...action.clusters];
      const u = Object.assign({}, state, {
        polygon_stops: Object.assign({}, state.polygon_stops, action.stops),
        cluster_done_list: updated_cluster_done_list,
        busy_data: false
      });
      console.log('reducerMain:', window.performance.now() - t);
      return u;
    case 'UPDATE_MOE_DATA':
      const updated_moe_cluster_done_list = [...state.moe_cluster_done_list, ...action.clusters];
      return Object.assign({}, state, {
        moe_stops: Object.assign({}, state.moe_stops, action.stops),
        moe_cluster_done_list: updated_moe_cluster_done_list,
        busy_moe: false
      });
    case 'UPDATE_DATASET':
      console.log('updating dataset');
      return Object.assign({}, state, {
        source_dataset: action.dataset,
        polygon_stops: {},
        mouseover_statistic: undefined,
        mouseover_moe: undefined,
        mouseover_label: undefined,
        cluster_done_list: []
      });
    case 'UPDATE_GEOGRAPHY':
      console.log('updating geography');
      return Object.assign({}, state, {
        source_geography: action.geography,
        polygon_stops: {},
        mouseover_statistic: undefined,
        mouseover_moe: undefined,
        mouseover_label: undefined,
        cluster_done_list: []
      });
    case 'UPDATE_THEME':
      console.log('updating theme');
      return Object.assign({}, state, {
        selected_attr: action.theme,
        polygon_stops: {},
        mouseover_statistic: undefined,
        mouseover_moe: undefined,
        mouseover_label: undefined,
        cluster_done_list: []
      });
    case 'UPDATE_MOUSEOVER':
      return Object.assign({}, state, {
        mouseover_statistic: action.mouseover_statistic,
        mouseover_label: action.mouseover_label,
        mouseover_moe: action.mouseover_moe
      });
    default:
      return state;
  }
};

export default map;
