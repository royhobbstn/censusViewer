//
import { store } from '../index.js';

import {
  unbusyData,
  updateStyleData,
  changeMouseoverStatistic
}
from '../Redux/actions.js';

import { convertDataToStops } from '../Service/data_to_styles.js';

import worker_script from '../Worker/fetch_worker.js';

export const myEstWorker = new Worker(worker_script);




// give a unique increment id number to each new layer created
let layer_add = 0;


myEstWorker.onmessage = (m) => {

  if (!m || !m.data) {
    store.dispatch(unbusyData());
  }
  else {

    if (m.data.type === 'fetch') {

      layer_add++;

      console.time('start');
      console.time('start1');
      console.time('start2');
      console.time('start3');

      // TODO lift this calculation to a worker
      const values = convertDataToStops(m.data.data.data, m.data.attr, m.data.source_dataset, m.data.sumlev);
      console.timeEnd('start1');

      const unique_geoids = Object.keys(values);

      console.timeEnd('start2');


      const stops = unique_geoids.map(key => {
        return [key, values[key]];
      });

      console.timeEnd('start3');


      // to avoid 'must have stops' errors
      const drawn_stops = (stops.length) ? stops : [
        ["0", 'blue']
      ];

      console.timeEnd('start');

      const new_layer_name = `tiles-polygons-${layer_add}`;

      window.map.addLayer({
        'id': new_layer_name,
        'type': 'fill',
        'source': 'tiles',
        'source-layer': 'main',
        filter: ['in', 'GEOID', ...unique_geoids],
        'paint': {
          'fill-antialias': false,
          'fill-opacity': 0.6,
          'fill-color': {
            property: 'GEOID',
            type: 'categorical',
            stops: drawn_stops
          }
        }
      }, "blank");

      window.map.addLayer({
        'id': new_layer_name + '_line',
        'type': 'line',
        'source': 'tiles',
        'source-layer': 'main',
        filter: ['in', 'GEOID', ...unique_geoids],
        'paint': {
          'line-opacity': 0.8,
          'line-width': 0.5,
          'line-offset': 0.25,
          'line-color': {
            property: 'GEOID',
            type: 'categorical',
            stops: drawn_stops
          }
        }
      }, "blank");

      store.dispatch(updateStyleData(m.data.data.clusters, new_layer_name));

    }
    else if (m.data.type === 'lookup') {
      store.dispatch(changeMouseoverStatistic(m.data.data));
    }
  }

};
