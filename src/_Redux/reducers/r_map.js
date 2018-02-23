// reducer

import { configuration } from '../../_Config_JSON/configuration.mjs';


const default_state = {
  polygon_stops: {},
  source_geography: configuration.startup.source_geography,
  source_dataset: configuration.startup.source_dataset,
  selected_attr: configuration.startup.selected_attr,
  mouseover_statistic: undefined,
  mouseover_moe: undefined,
  mouseover_label: undefined,
  in_progress_cluster_list: [],
  cluster_done_list: []
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
        mouseover_moe: action.mouseover_moe,
        mouseover_label: action.mouseover_label
      });
    case 'ADD_TO_IN_PROGRESS':
      return Object.assign({}, state, { in_progress_cluster_list: [...state.in_progress_cluster_list, ...action.arr] });
    case 'REMOVE_FROM_IN_PROGRESS':
      const new_in_progress_cluster_list = state.in_progress_cluster_list.filter(cluster => {
        return !action.arr.includes(cluster);
      });
      return Object.assign({}, state, { in_progress_cluster_list: new_in_progress_cluster_list });
    case 'ADD_TO_CLUSTERS_DONE':
      return Object.assign({}, state, { cluster_done_list: [...state.cluster_done_list, ...action.arr] });
    default:
      return state;
  }
};

export default map;
