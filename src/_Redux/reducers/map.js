// this is a reducer

const default_stops = [];


const default_source = {
  "type": "vector",
  "tiles": ["https://s3-us-west-2.amazonaws.com/serve-vector-tiles/place_carto_c2010/{z}/{x}/{y}.pbf"]
};

const default_state = {
  polygon_stops: default_stops,
  polygon_source: default_source
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
    case 'UPDATE_POLYGON_SOURCE':
      return Object.assign({}, state, {
        polygon_source: action.data
      });
    case 'RESET_MAP':
      console.log('map cleared');
      return Object.assign({}, JSON.parse(JSON.stringify(default_state)));
    default:
      return state;
  }
};

export default map;
