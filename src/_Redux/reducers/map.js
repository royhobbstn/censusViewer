// this is a reducer

const default_stops = [];


const default_state = {
  polygon_stops: default_stops,
  source_geography: 'county',
  source_dataset: 'acs1014'
};

const map = (
  // this sets initial state
  state = default_state,
  action
) => {
  switch (action.type) {
    case 'UPDATE_POLYGON_STYLE':
      console.log('updating');
      return Object.assign({}, state, {
        polygon_stops: action.stops
      });
    case 'UPDATE_DATASET':
      console.log('updating dataset');
      return Object.assign({}, state, {
        source_dataset: action.dataset,
        polygon_stops: []
      });
    default:
      return state;
  }
};

export default map;
