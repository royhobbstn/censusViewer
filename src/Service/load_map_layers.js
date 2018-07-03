//

import { configuration } from '../Config/configuration.js';
import { datasetToYear } from '../Service/utility.js';


export function loadMapLayers(source_geography, source_dataset) {


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

  window.map.addSource('mouseover', {
    "type": "geojson",
    "data": {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [0, 0]
        },
        "properties": {
          "title": ""
        }
      }]
    }
  });

  window.map.addLayer({
    "id": "points",
    "type": "symbol",
    "source": "mouseover",
    "layout": {
      "text-field": "{title}",
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-size": 12,
      "text-justify": "left",
      "text-anchor": "bottom-left"
    },
    "paint": {
      "text-halo-color": "white",
      "text-halo-width": 3
    }
  });



  // TODO directly change style object
  // Add a filter for only US Geo
  window.map.setPaintProperty('admin_level_3', 'line-color', 'black');
  window.map.setPaintProperty('admin_level_3', 'line-width', 1);

  window.map.setPaintProperty('admin_level_2', 'line-color', 'black');
  window.map.setPaintProperty('admin_level_2', 'line-width', 2);

}
