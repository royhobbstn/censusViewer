/* global fetch */

import React, { Component } from 'react';
import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import key from './mapbox_api_key.js';
import _ from 'lodash';
import equal from 'fast-deep-equal';
import { configuration } from '../_Config_JSON/configuration.js';
import { state_lookup } from '../_Config_JSON/state_lookup.js';
// import { style } from '../_Config_JSON/style.js';
import cache_worker from './cache_worker';
var myCacheWorker = new Worker(cache_worker);

class Map extends Component {
  componentDidMount() {

    mapboxgl.accessToken = key.key;
    window.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-104.9, 39.75],
      zoom: 7,
      maxZoom: 13,
      minZoom: 3
      //maxBounds: [[-73.9876, 40.7661], [-73.9397, 40.8002]] west south east north
    });

    window.map.on('load', () => {


      const findNew = _.throttle((e) => {
        // const trt = window.performance.now();
        const screenX = e ? e.originalEvent.x : false;
        const screenY = e ? e.originalEvent.y : false;

        const pole = e ? window.map.unproject([screenX, screenY]) : window.map.getCenter();
        const current_zoom = window.map.getZoom();
        const current_bounds = window.map.getBounds();

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
              tiles_to_get.push(`https://${configuration.tiles[0]}/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}/${zoom}/${j}/${i}.pbf`);
              // TODO? optimistic mapbox tile fetching turned off
              // tiles_to_get.push(`https://a.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/${zoom}/${j}/${i}.vector.pbf?access_token=${key.key}`);
            }
          }

        });


        const filtered_tiles_to_get = tiles_to_get.filter(tile_url => {
          return !this.props.tiles_already_requested.includes(tile_url);
        });

        // console.log('findNew:', window.performance.now() - trt);

        if (filtered_tiles_to_get.length) {
          myCacheWorker.postMessage(filtered_tiles_to_get);
          this.props.addToRequested(filtered_tiles_to_get);
        }

        this.props.updateClusters(pole, current_zoom, current_bounds);
      }, 500);

      findNew();

      window.map.addSource('tiles', {
        "type": "vector",
        "minzoom": 3,
        "maxzoom": 9,
        "tiles": [`https://${configuration.tiles[0]}/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}/{z}/{x}/{y}.pbf`, `https://${configuration.tiles[1]}/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}/{z}/{x}/{y}.pbf`, `https://${configuration.tiles[2]}/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}/{z}/{x}/{y}.pbf`]
      });

      window.map.addLayer({
        'id': 'tiles-polygons',
        'type': 'fill',
        'source': 'tiles',
        'source-layer': 'main',
        'paint': {
          'fill-opacity': 0.35
        }
      }, "admin-2-boundaries-dispute");

      window.map.on('moveend', _.throttle((e) => {
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

      window.map.on('zoomstart', _.throttle((e) => {
        if (e.originalEvent) {
          findNew(e);
        }
      }, 600));

      window.map.on('mousemove', 'tiles-polygons', _.throttle((e) => {

        window.map.getCanvas().style.cursor = 'pointer';
        const geoid = e.features[0].properties.GEOID;
        const name = e.features[0].properties.NAME;
        const label = getLabel(geoid, name);
        if (geoid && label) {
          this.props.updateMouseover(geoid, label);
        }
      }, 132));

      window.map.on('error', event => console.log(event));

    });

  }

  renderMap = _.throttle((drawn_stops) => {

    window.map.setPaintProperty('tiles-polygons', 'fill-color', {
      property: 'GEOID',
      type: 'categorical',
      stops: drawn_stops
    });

  }, 500);

  shouldComponentUpdate(nextProps, nextState) {
    // redraw layer on redux style change

    if (this.props.source_geography !== nextProps.source_geography || this.props.source_dataset !== nextProps.source_dataset) {
      // geography or year changed.  update source and redraw

      window.map.removeLayer('tiles-polygons');

      window.map.removeSource('tiles');

      window.map.addSource('tiles', {
        "type": "vector",
        "minzoom": 3,
        "maxzoom": 9,
        "tiles": [`https://${configuration.tiles[0]}/${nextProps.source_geography}_${datasetToYear(nextProps.source_dataset)}/{z}/{x}/{y}.pbf`, `https://${configuration.tiles[1]}/${nextProps.source_geography}_${datasetToYear(nextProps.source_dataset)}/{z}/{x}/{y}.pbf`, `https://${configuration.tiles[2]}/${nextProps.source_geography}_${datasetToYear(nextProps.source_dataset)}/{z}/{x}/{y}.pbf`]
      });

      window.map.addLayer({
        'id': 'tiles-polygons',
        'type': 'fill',
        'source': 'tiles',
        'source-layer': 'main',
        'paint': {
          'fill-opacity': 0.35
        }
      }, "admin-2-boundaries-dispute");

      return false;
    }

    if (!equal(this.props.polygon_stops, nextProps.polygon_stops)) {
      // convert object keys:values to stops array
      const trt = window.performance.now();

      const values = convertDataToStops(nextProps.polygon_stops);

      const unique_geoids = Object.keys(values);

      const stops = unique_geoids.map(key => {
        return [key, values[key]];
      });

      // to avoid 'must have stops' errors
      const drawn_stops = (stops.length) ? stops : [
        ["0", 'blue']
      ];

      const rd_delay = window.performance.now() - trt;
      window.redraw += rd_delay;
      console.log('mapRedrawing:', rd_delay);

      const trt2 = window.performance.now();
      // window.map.setFilter('tiles-polygons', ['in', 'GEOID', ...unique_geoids]);
      const rp_delay = window.performance.now() - trt2;
      window.repaint += rp_delay;
      console.log('mapRepaint:', rp_delay);

      const trt3 = window.performance.now();
      this.renderMap(drawn_stops);
      const rm_delay = window.performance.now() - trt3;
      window.render_map += rm_delay;
      console.log('renderMap:', rm_delay);
    }

    return false;
  }

  render() {
    return <div id="map" />;
  }
}


export default Map;


function datasetToYear(dataset) {
  return configuration.datasets[dataset].year;
}

function getLabel(geoid, name) {

  switch (geoid.length) {
    case 12:
      // block group: 081230025011
      return `BG ${geoid.slice(-1)}, Tract ${geoid.slice(-7,-1)}, ${state_lookup[geoid.slice(0,2)]}`;
    case 11:
      // tract: 08005007703
      return `Tract ${geoid.slice(-6)}, ${state_lookup[geoid.slice(0,2)]}`;
    case 7:
      // place
      return `${name}, ${state_lookup[geoid.slice(0,2)]}`;
    case 5:
      // county
      return `${name} County, ${state_lookup[geoid.slice(0,2)]}`;
    case 2:
      // state
      return name;
    default:
      return '';
  }

}



function convertDataToStops(data) {
  //
  const p_stops = {};
  Object.keys(data).forEach(key => {
    p_stops[key] = getStopColor(data[key]);
  });
  return p_stops;
}

function getStopColor(value) {
  //
  if (value === undefined) {
    return "black";
  }

  if (value > 90000) {
    return '#016c59';
  }
  else if (value > 65000) {
    return '#1c9099';
  }
  else if (value > 45000) {
    return '#67a9cf';
  }
  else if (value > 30000) {
    return '#bdc9e1';
  }
  else {
    return '#f6eff7';
  }
}


function long2tile(lon, zoom) { return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom))); }

function lat2tile(lat, zoom) { return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))); }
