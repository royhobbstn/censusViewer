//

import { throttle } from 'lodash';
import { getLabel } from '../Service/utility.js';
import { calcTileCache } from '../Service/calc_tile_precache.js';
import cache_worker from '../Worker/cache_worker';

const myCacheWorker = new Worker(cache_worker);

//

export function loadMouseEvents(getCurrentData,
  addToRequested, updateClusters, updateMouseover, updateZoomMessage) {
  //

  const findNew = (e, center) => {

    console.log('fired');

    updateZoomMessage(window.map.getZoom());

    const screenX = e ? e.originalEvent.x : false;
    const screenY = e ? e.originalEvent.y : false;

    const pole = e ? window.map.unproject([screenX, screenY]) : window.map.getCenter();

    const current_zoom = window.map.getZoom();
    const current_bounds = window.map.getBounds();

    const { source_geography, source_dataset, tiles_already_requested } = getCurrentData();

    const filtered_tiles_to_get = calcTileCache(pole, current_zoom, current_bounds, source_geography, source_dataset, tiles_already_requested);

    if (filtered_tiles_to_get.length) {
      myCacheWorker.postMessage(filtered_tiles_to_get);
      addToRequested(filtered_tiles_to_get);
    }

    updateClusters(pole, current_zoom, current_bounds);
  };

  // get initial map data (trigger initial map render)
  findNew();

  // custom event to manually trigger redraw on geo/dataset/theme change
  window.map.on('redraw', () => {
    console.log('redraw');
    findNew();
  });

  window.map.on('moveend', (e => {
    if (e.originalEvent) {
      findNew(e);
    }
  }));

  window.map.on('zoomstart', throttle((e) => {
    if (e.originalEvent) {
      findNew(e);
    }
  }, 500));

  //


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
