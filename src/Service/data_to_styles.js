//



const { datatree } = require('../Config/datatree.js');
const { breaks } = require('../Config/computed_breaks.js');
const colortree = require('../Config/colortree.json');

//

export function convertDataToStops(data, attr, source_dataset, sumlev) {
  //

  const theme_info = datatree[source_dataset][attr];

  // TODO temporarily set everything to favstyle
  // in future this logic moved to when selecting a new theme
  // and logic here will just grab existing style info from 

  const favstyle = theme_info.favstyle;

  const components = favstyle.split(',');

  const classify = components[0];
  const break_count = components[1];
  const colorscheme = components[2];


  const color_info = colortree[`${colorscheme}_${break_count}`];

  const break_values = breaks[source_dataset][attr][sumlev][`${classify}${break_count}`];

  const p_stops = {};
  Object.keys(data).forEach(key => {
    p_stops[key] = getStopColor(data[key], color_info, break_values);
  });
  return p_stops;
}

function getStopColor(value, color_info, break_values) {
  //
  if (!value && value !== 0) {
    // null, undefined, NaN
    return color_info.ifnull;
  }
  else if (value === 0) {
    // zero value
    return color_info.ifzero;
  }

  const arr_length = break_values.length;
  let color = 'black';

  break_values.forEach((brval, index) => {
    if (index === 0 && value < brval) {
      // less than first value in breaks array
      color = color_info.colors[index];
    }
    else if ((index === (arr_length - 1)) && value >= brval) {
      // greater than last item in breaks array
      color = color_info.colors[index + 1];
    }
    else if (value >= brval && value < break_values[index + 1]) {
      // between two break values
      color = color_info.colors[index + 1];
    }
  });

  return color;

}
