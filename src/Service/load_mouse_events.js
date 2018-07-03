//

import { throttle } from 'lodash';
import { getLabel } from '../Service/utility.js';
import { calcTileCache } from '../Service/calc_tile_precache.js';
import cache_worker from '../Worker/cache_worker';

const myCacheWorker = new Worker(cache_worker);

//

export function loadMouseEvents(source_geography, source_dataset, tiles_already_requested, addToRequested, updateClusters, updateMouseover) {
  //


  const findNew = throttle((e) => {

    const screenX = e ? e.originalEvent.x : false;
    const screenY = e ? e.originalEvent.y : false;

    const pole = e ? window.map.unproject([screenX, screenY]) : window.map.getCenter();
    const current_zoom = window.map.getZoom();
    const current_bounds = window.map.getBounds();

    const filtered_tiles_to_get = calcTileCache(pole, current_zoom, current_bounds, source_geography, source_dataset, tiles_already_requested);

    if (filtered_tiles_to_get.length) {
      myCacheWorker.postMessage(filtered_tiles_to_get);
      addToRequested(filtered_tiles_to_get);
    }

    updateClusters(pole, current_zoom, current_bounds);
  }, 500);

  findNew();


  window.map.on('moveend', throttle((e) => {
    if (e.originalEvent) {
      findNew(e);
    }
  }), 750);

  // when map data source is changed
  window.map.on('sourcedata', (e) => {
    if (e.isSourceLoaded) {
      findNew();
    }
  });

  window.map.on('zoomstart', throttle((e) => {
    if (e.originalEvent) {
      findNew(e);
    }
  }, 600));

  window.map.on('mousemove', 'tiles-polygons', throttle((e) => {

    window.map.getCanvas().style.cursor = 'pointer';
    const geoid = e.features[0].properties.GEOID;
    const name = e.features[0].properties.NAME;
    const label = getLabel(geoid, name);
    const coords = [e.lngLat.lng, e.lngLat.lat];

    if (geoid && label) {
      updateMouseover(geoid, label, coords);
    }

  }, 132));


  //
}
