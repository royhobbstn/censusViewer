//

import { configuration } from '../Config/configuration.js';
import { datasetToYear } from '../Service/utility.js';


export function loadMapLayers(source_geography, source_dataset) {

  window.map.addSource('point', {
    "type": "geojson",
    "data": {
      "type": "Point",
      "coordinates": [0, 0]
    }
  });

  window.map.addLayer({
    "id": "point",
    "source": "point",
    "type": "circle",
    "paint": {
      "circle-radius": 4,
      "circle-color": "red"
    }
  });


  window.map.addSource('tiles', {
    "type": "vector",
    "minzoom": 3,
    "maxzoom": 9,
    "tiles": [`https://${configuration.tiles[0]}/${source_geography}_${datasetToYear(source_dataset)}/{z}/{x}/{y}.pbf`,
      `https://${configuration.tiles[1]}/${source_geography}_${datasetToYear(source_dataset)}/{z}/{x}/{y}.pbf`,
      `https://${configuration.tiles[2]}/${source_geography}_${datasetToYear(source_dataset)}/{z}/{x}/{y}.pbf`
    ]
  });

  window.map.addSource('county-boundary', {
    "type": "vector",
    "minzoom": 3,
    "maxzoom": 9,
    "tiles": [`https://${configuration.tiles[0]}/county_2016/{z}/{x}/{y}.pbf`,
      `https://${configuration.tiles[1]}/county_2016/{z}/{x}/{y}.pbf`,
      `https://${configuration.tiles[2]}/county_2016/{z}/{x}/{y}.pbf`
    ]
  });

  window.map.addLayer({
    'id': 'tiles-polygons',
    'type': 'fill',
    'source': 'tiles',
    'source-layer': 'main',
  }, "background");

  window.map.addLayer({
    'id': 'counties',
    'type': 'line',
    'source': 'county-boundary',
    'source-layer': 'main',
    'paint': {
      'line-color': 'black',
      'line-width': 1,
      'line-opacity': 0.5,
      'line-dasharray': [1, 1]
    }
  }, "admin_level_3");


  // TODO directly change style object
  // Add a filter for only US Geo
  window.map.setPaintProperty('admin_level_3', 'line-color', 'black');
  window.map.setPaintProperty('admin_level_3', 'line-width', 1);

  window.map.setPaintProperty('admin_level_2', 'line-color', 'black');
  window.map.setPaintProperty('admin_level_2', 'line-width', 2);

}
