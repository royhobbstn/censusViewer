//

import { configuration } from '../Config/configuration.js';
import { datasetToYear } from '../Service/utility.js';
import { key } from '../Component/mapbox_api_key.js';


export function calcTileCache(pole, current_zoom, current_bounds, source_geography, source_dataset, tiles_already_requested) {


  const pole_lat = pole.lat;
  const pole_lng = pole.lng;

  const current_sw = current_bounds._sw;
  const current_ne = current_bounds._ne;
  const lat_span = Math.abs(current_sw.lat - current_ne.lat);
  const lng_span = Math.abs(current_sw.lng - current_ne.lng);
  const pct_along_lat = (pole_lat - current_sw.lat) / lat_span;
  const pct_along_lng = (pole_lng - current_sw.lng) / lng_span;

  const bounds_obj = {};

  [3, 4, 5, 6, 7, 8, 9].forEach(new_zoom => {
    const zoom_difference = current_zoom - new_zoom;

    const new_lat_span = lat_span * Math.pow(2, zoom_difference);
    const new_lng_span = lng_span * Math.pow(2, zoom_difference);
    const new_sw_lat = pole_lat - (pct_along_lat * new_lat_span);
    const new_ne_lat = pole_lat + ((1 - pct_along_lat) * new_lat_span);
    let new_sw_lng = pole_lng - (pct_along_lng * new_lng_span);
    let new_ne_lng = pole_lng + ((1 - pct_along_lng) * new_lng_span);

    // doesn't appear to be any issues with latitude out of bounds
    // lng out of bounds below
    if (new_sw_lng < -180) {
      console.log({ msg: 'wrapping new_sw_lng' });
      new_sw_lng = new_sw_lng + 360;
    }
    if (new_sw_lng > 180) {
      console.log({ msg: 'wrapping new_sw_lng (RARE!)' });
      new_sw_lng = new_sw_lng - 360; // rare to impossible
    }

    if (new_ne_lng < -180) {
      console.log({ msg: 'wrapping new_ne_lng (RARE!)' });
      new_ne_lng = new_ne_lng + 360; // rare to impossible
    }
    if (new_ne_lng > 180) {
      console.log({ msg: 'wrapping new_ne_lng' });
      new_ne_lng = new_ne_lng - 360;
    }


    bounds_obj[new_zoom] = [
      [new_sw_lng, new_sw_lat],
      [new_ne_lng, new_ne_lat]
    ];

  });

  const tiles_to_get = [];

  Object.keys(bounds_obj).forEach(zoom => {
    const sw_lat = bounds_obj[zoom][0][1];
    const sw_lng = bounds_obj[zoom][0][0];
    const ne_lat = bounds_obj[zoom][1][1];
    const ne_lng = bounds_obj[zoom][1][0];

    let lat_tile_1 = lat2tile(sw_lat, zoom);
    let lat_tile_2 = lat2tile(ne_lat, zoom);

    if (lat_tile_1 > lat_tile_2) {
      let temp = lat_tile_1;
      lat_tile_1 = lat_tile_2;
      lat_tile_2 = temp;
    }

    let long_tile_1 = long2tile(sw_lng, zoom);
    let long_tile_2 = long2tile(ne_lng, zoom);

    if (long_tile_1 > long_tile_2) {
      let temp = long_tile_1;
      long_tile_1 = long_tile_2;
      long_tile_2 = temp;
    }

    for (let i = lat_tile_1; i <= lat_tile_2; i++) {
      for (let j = long_tile_1; j < long_tile_2; j++) {
        tiles_to_get.push(`https://${configuration.tiles[0]}/${source_geography}_${datasetToYear(source_dataset)}/${zoom}/${j}/${i}.pbf`);
        // optimistic mapbox tile fetching turned off
        // tiles_to_get.push(`https://a.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/${zoom}/${j}/${i}.vector.pbf?access_token=${key.key}`);
        tiles_to_get.push(`https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v7/${zoom}/${j}/${i}.vector.pbf?access_token=${key}`);
      }
    }

  });


  return tiles_to_get.filter(tile_url => {
    return !tiles_already_requested.includes(tile_url);
  });

}



function long2tile(lon, zoom) {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

function lat2tile(lat, zoom) {
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}
