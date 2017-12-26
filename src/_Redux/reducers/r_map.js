// reducer

const default_stops = {};


const default_state = {
  polygon_stops: default_stops,
  source_geography: 'county',
  source_dataset: 'acs1115',
  selected_attr: 'bachlhghr',
  is_busy: false,
  mouseover_statistic: '',
  mouseover_moe: '',
  mouseover_label: ''
};

const map = (
  state = default_state,
  action
) => {
  switch (action.type) {
    case 'UPDATE_POLYGON_STYLE':
      return Object.assign({}, state, {
        polygon_stops: Object.assign({}, action.stops, state.polygon_stops),
        is_busy: false
      });
    case 'UPDATE_DATASET':
      console.log('updating dataset');
      return Object.assign({}, state, {
        source_dataset: action.dataset,
        polygon_stops: []
      });
    case 'UPDATE_GEOGRAPHY':
      console.log('updating geography');
      return Object.assign({}, state, {
        source_geography: action.geography,
        polygon_stops: []
      });
    case 'UPDATE_THEME':
      console.log('updating theme');
      return Object.assign({}, state, {
        selected_attr: action.theme,
        polygon_stops: []
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
