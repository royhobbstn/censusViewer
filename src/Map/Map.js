/* global fetch */

import React, { Component } from 'react';
import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import key from './mapbox_api_key.js';
import { throttle } from 'lodash';
import { configuration } from '../Config/configuration.js';
import { state_lookup } from '../Config/state_lookup.js';
import { style } from '../Config/style.js';
import cache_worker from './cache_worker';
import { datasetToYear } from '../_Redux/thunks/t_map.js';
const { datatree } = require('../Config/datatree.js');

var myCacheWorker = new Worker(cache_worker);

class Map extends Component {
  componentDidMount() {

    mapboxgl.accessToken = key.key;
    window.map = new mapboxgl.Map({
      container: 'map',
      style,
      center: [-104.9, 39.75],
      zoom: 7,
      maxZoom: 13,
      minZoom: 3
      //maxBounds: [[-73.9876, 40.7661], [-73.9397, 40.8002]] west south east north
    });

    window.map.on('load', () => {


      const findNew = throttle((e) => {
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

      window.map.addSource('county-boundary', {
        "type": "vector",
        "minzoom": 3,
        "maxzoom": 9,
        "tiles": [`https://${configuration.tiles[0]}/county_2016/{z}/{x}/{y}.pbf`, `https://${configuration.tiles[1]}/county_2016/{z}/{x}/{y}.pbf`, `https://${configuration.tiles[2]}/county_2016/{z}/{x}/{y}.pbf`]
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

      // revisit with a filter

      window.map.setPaintProperty('admin_level_3', 'line-color', 'black');
      window.map.setPaintProperty('admin_level_3', 'line-width', 1);

      window.map.setPaintProperty('admin_level_2', 'line-color', 'black');
      window.map.setPaintProperty('admin_level_2', 'line-width', 2);

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
          this.props.updateMouseover(geoid, label, coords);
        }

      }, 132));

      window.map.on('error', event => console.log(event));

    });

  }


  shouldComponentUpdate(nextProps, nextState) {

    // redraw layer on theme / geo / dataset change
    if (this.props.source_geography !== nextProps.source_geography || this.props.source_dataset !== nextProps.source_dataset || this.props.selected_attr !== nextProps.selected_attr) {
      console.log('geography, theme or dataset changed');
      // geography or year changed.  update source and redraw
      this.props.clearActiveLayers();
    }

    // update mouseover text
    if (this.props.mouseover_statistic !== nextProps.mouseover_statistic || this.props.mouseover_label !== nextProps.mouseover_label || this.props.mouseover_moe !== nextProps.mouseover_moe || this.props.mouseover_coords !== nextProps.mouseover_coords) {

      window.map.getSource('mouseover').setData({
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": nextProps.mouseover_coords
          },
          "properties": {
            "title": `${nextProps.mouseover_label}\n${formatNumber(nextProps.mouseover_statistic, nextProps.source_dataset, nextProps.selected_attr)}  ± ${formatNumber(nextProps.mouseover_moe, nextProps.source_dataset, nextProps.selected_attr)}`
          }
        }]
      });

    }

    return false;
  }

  render() {
    return <div id="map" />;
  }
}


export default Map;




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




function long2tile(lon, zoom) { return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom))); }

function lat2tile(lat, zoom) { return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))); }



function formatNumber(num, dataset, attr) {

  const configuration = datatree[dataset][attr];
  const mininc = configuration.mininc;

  let big_mult = 0;


  if (mininc === "1") {
    // round to integer
    big_mult = 1;
  }
  else if (mininc === "0.1") {
    // round to tenths
    big_mult = 10;
  }
  else if (mininc === "0.01") {
    // round to hundredths
    big_mult = 100;
  }
  else if (mininc === "0.001") {
    // round to thousandths
    big_mult = 1000;
  }


  if (configuration.type === 'currency') {
    return `$ ${parseInt(num, 10).toLocaleString()}`;
  }
  else if (configuration.type === 'regular') {
    return num;
  }
  else if (configuration.type === 'percent') {
    return `${parseInt(num*100*big_mult, 10)/big_mult} %`;
  }
  else {
    console.log('unknown number type ' + configuration.type);
    return num;
  }
}
