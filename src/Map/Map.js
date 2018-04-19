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

      const updateTiles = _.debounce(() => {
        // get all clusters
        const features = window.map.querySourceFeatures('clusters', {
          sourceLayer: 'main'
        });

        const zoomlev = window.map.getZoom();
        const clusters = new Set();

        features.forEach(feature => {
          const cluster = feature.properties.cluster;
          const feature_zoom = parseInt(cluster.split('_')[0], 10);
          if (feature_zoom <= zoomlev) {
            clusters.add(cluster);
          }
        });

        this.props.updateClusters(Array.from(clusters));
      }, 30);

      window.map.addSource('tiles', {
        "type": "vector",
        "tiles": [`https://${configuration.tiles[0]}/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}/{z}/{x}/{y}.pbf`, `https://${configuration.tiles[1]}/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}/{z}/{x}/{y}.pbf`, `https://${configuration.tiles[2]}/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}/{z}/{x}/{y}.pbf`]
      });

      window.map.addSource('clusters', {
        "type": "vector",
        "tiles": [`https://${configuration.cluster_tiles[0]}/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}_cl/{z}/{x}/{y}.pbf`, `https://${configuration.cluster_tiles[1]}/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}_cl/{z}/{x}/{y}.pbf`, `https://${configuration.cluster_tiles[2]}/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}_cl/{z}/{x}/{y}.pbf`]
      });

      window.map.addLayer({
        'id': 'cluster-polygons',
        'type': 'fill',
        'source': 'clusters',
        'source-layer': 'main',
        'filter': ["==", "$type", "LineString"] // nonsense filter which ensures nothing is visible
      }, "admin-2-boundaries-dispute");

      window.map.addLayer({
        'id': 'tiles-polygons',
        'type': 'fill',
        'source': 'tiles',
        'source-layer': 'main',
        'paint': {
          'fill-opacity': 0.35
        }
      }, "admin-2-boundaries-dispute");

      window.map.on('moveend', (e) => {
        updateTiles();
      });

      // when map data source is changed
      window.map.on('sourcedata', (e) => {
        if (e.isSourceLoaded) {
          updateTiles();
        }
      });

      window.map.on('zoomstart', (e) => {
        console.log('zoomstart');

        const zoomlev = window.map.getZoom();
      });

      window.map.on('mousemove', 'tiles-polygons', _.throttle((e) => {
        window.map.getCanvas().style.cursor = 'pointer';
        const geoid = e.features[0].properties.GEOID;
        const name = e.features[0].properties.NAME;
        const label = getLabel(geoid, name);
        if (geoid && label) {
          this.props.updateMouseover(geoid, label);
        }
      }, 32));

      window.map.on('error', event => console.log(event));

    });

  }

  renderMap = _.throttle((drawn_stops) => {

    window.map.setPaintProperty('tiles-polygons', 'fill-color', {
      property: 'GEOID',
      type: 'categorical',
      stops: drawn_stops
    });

  }, 1000);

  shouldComponentUpdate(nextProps, nextState) {
    // redraw layer on redux style change

    if (this.props.source_geography !== nextProps.source_geography || this.props.source_dataset !== nextProps.source_dataset) {
      // geography or year changed.  update source and redraw

      window.map.removeLayer('tiles-polygons');

      window.map.removeSource('tiles');

      window.map.addSource('tiles', {
        "type": "vector",
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


      window.map.removeLayer('cluster-polygons');

      window.map.removeSource('clusters');

      window.map.addSource('clusters', {
        "type": "vector",
        "tiles": [`https://${configuration.cluster_tiles[0]}/${nextProps.source_geography}_${datasetToYear(nextProps.source_dataset)}_cl/{z}/{x}/{y}.pbf`, `https://${configuration.cluster_tiles[1]}/${nextProps.source_geography}_${datasetToYear(nextProps.source_dataset)}_cl/{z}/{x}/{y}.pbf`, `https://${configuration.cluster_tiles[2]}/${nextProps.source_geography}_${datasetToYear(nextProps.source_dataset)}_cl/{z}/{x}/{y}.pbf`]
      });

      window.map.addLayer({
        'id': 'cluster-polygons',
        'type': 'fill',
        'source': 'clusters',
        'source-layer': 'main',
        'filter': ["==", "$type", "LineString"] // nonsense filter which ensures nothing is visible
      }, "admin-2-boundaries-dispute");

      return false;
    }

    if (!equal(this.props.polygon_stops, nextProps.polygon_stops)) {
      // convert object keys:values to stops array

      const values = convertDataToStops(nextProps.polygon_stops);

      const unique_geoids = Object.keys(values);

      const stops = unique_geoids.map(key => {
        return [key, values[key]];
      });

      // to avoid 'must have stops' errors
      const drawn_stops = (stops.length) ? stops : [
        ["0", 'blue']
      ];

      // window.map.setFilter('tiles-polygons', ['in', 'GEOID', ...unique_geoids]);

      this.renderMap(drawn_stops);
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
