// reducer

import { configuration } from '../Config/configuration.js';


const default_state = {
  active_layer_names: [],
  busy_data: false,
  busy_moe: false,
  cluster_done_list: [],
  moe_cluster_done_list: [],
  source_geography: configuration.startup.source_geography,
  source_dataset: configuration.startup.source_dataset,
  selected_attr: configuration.startup.selected_attr,
  mouseover_statistic: undefined,
  mouseover_label: undefined,
  mouseover_coords: [0, 0],
  mouseover_moe: undefined,
  tiles_already_requested: []
};

const map = (
  state = default_state,
  action
) => {
  switch (action.type) {
    case 'UPDATE_MOUSEOVER_STATISTIC':
      return Object.assign({}, state, { mouseover_statistic: action.data });
    case 'UPDATE_MOUSEOVER_INFO':
      return Object.assign({}, state, { mouseover_label: action.data, mouseover_coords: action.coords });
    case 'UPDATE_MOUSEOVER_MOE':
      return Object.assign({}, state, { mouseover_moe: action.data });
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
      return Object.assign({}, state, {
        cluster_done_list: Array.from(new Set([...state.cluster_done_list, ...action.clusters])),
        busy_data: false,
        active_layer_names: [...state.active_layer_names, action.layer_name]
      });
    case 'UPDATE_MOE_DATA':
      return Object.assign({}, state, {
        moe_cluster_done_list: Array.from(new Set([...state.moe_cluster_done_list, ...action.clusters])),
        busy_moe: false
      });
    case 'UPDATE_DATASET':
      console.log('updating dataset');
      return Object.assign({}, state, {
        source_dataset: action.dataset,
        mouseover_statistic: undefined,
        mouseover_moe: undefined,
        mouseover_label: undefined,
        cluster_done_list: [],
        moe_cluster_done_list: []
      });
    case 'UPDATE_GEOGRAPHY':
      console.log('updating geography');
      return Object.assign({}, state, {
        source_geography: action.geography,
        mouseover_statistic: undefined,
        mouseover_moe: undefined,
        mouseover_label: undefined,
        cluster_done_list: [],
        moe_cluster_done_list: []
      });
    case 'UPDATE_THEME':
      console.log('updating theme');
      return Object.assign({}, state, {
        selected_attr: action.theme,
        mouseover_statistic: undefined,
        mouseover_moe: undefined,
        mouseover_label: undefined,
        cluster_done_list: [],
        moe_cluster_done_list: []
      });
    case 'CLEAR_ACTIVE_LAYER_NAMES':
      return Object.assign({}, state, {
        active_layer_names: []
      });
    default:
      return state;
  }
};

export default map;
