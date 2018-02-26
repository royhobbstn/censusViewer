// reducer

import { configuration } from '../../_Config_JSON/configuration.js';


const default_state = {
  polygon_stops: {},
  in_progress_cluster_list: [],
  cluster_done_list: [],
  moe_stops: {},
  in_progress_moe_cluster_list: [],
  moe_cluster_done_list: [],
  source_geography: configuration.startup.source_geography,
  source_dataset: configuration.startup.source_dataset,
  selected_attr: configuration.startup.selected_attr,
  mouseover_statistic: undefined,
  mouseover_label: undefined,
  mouseover_moe: undefined
};

const map = (
  state = default_state,
  action
) => {
  switch (action.type) {
    case 'UPDATE_POLYGON_STYLE':
      const updated_in_progress_cluster_list = state.in_progress_cluster_list.filter(cluster => {
        return !action.clusters.includes(cluster);
      });
      const updated_cluster_done_list = [...state.cluster_done_list, ...action.clusters];
      return Object.assign({}, state, {
        polygon_stops: Object.assign({}, state.polygon_stops, action.stops),
        in_progress_cluster_list: updated_in_progress_cluster_list,
        cluster_done_list: updated_cluster_done_list
      });
    case 'UPDATE_MOE_DATA':
      const updated_in_progress_moe_cluster_list = state.in_progress_moe_cluster_list.filter(cluster => {
        return !action.clusters.includes(cluster);
      });
      const updated_moe_cluster_done_list = [...state.moe_cluster_done_list, ...action.clusters];
      return Object.assign({}, state, {
        moe_stops: Object.assign({}, state.moe_stops, action.stops),
        in_progress_moe_cluster_list: updated_in_progress_moe_cluster_list,
        moe_cluster_done_list: updated_moe_cluster_done_list
      });
    case 'UPDATE_DATASET':
      console.log('updating dataset');
      return Object.assign({}, state, {
        source_dataset: action.dataset,
        polygon_stops: {},
        mouseover_statistic: undefined,
        mouseover_moe: undefined,
        mouseover_label: undefined,
        in_progress_cluster_list: [],
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
        in_progress_cluster_list: [],
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
        in_progress_cluster_list: [],
        cluster_done_list: []
      });
    case 'UPDATE_MOUSEOVER':
      return Object.assign({}, state, {
        mouseover_statistic: action.mouseover_statistic,
        mouseover_label: action.mouseover_label,
        mouseover_moe: action.mouseover_moe
      });
    case 'ADD_TO_IN_PROGRESS':
      return Object.assign({}, state, { in_progress_cluster_list: [...state.in_progress_cluster_list, ...action.arr] });
    case 'ADD_TO_MOE_IN_PROGRESS':
      return Object.assign({}, state, { in_progress_moe_cluster_list: [...state.in_progress_moe_cluster_list, ...action.arr] });
    case 'REMOVE_FROM_IN_PROGRESS':
      const new_in_progress_cluster_list = state.in_progress_cluster_list.filter(cluster => {
        return !action.arr.includes(cluster);
      });
      return Object.assign({}, state, { in_progress_cluster_list: new_in_progress_cluster_list });
    case 'REMOVE_FROM_MOE_IN_PROGRESS':
      const new_in_progress_moe_cluster_list = state.in_progress_moe_cluster_list.filter(cluster => {
        return !action.arr.includes(cluster);
      });
      return Object.assign({}, state, { in_progress_moe_cluster_list: new_in_progress_moe_cluster_list });
    default:
      return state;
  }
};

export default map;
