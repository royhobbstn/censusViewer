/* global fetch */

import React, { Component } from 'react';
import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import key from './mapbox_api_key.js';
import _ from 'lodash';
import { datasetToYear } from '../_Modules/util.js';






class Map extends Component {
  componentDidMount() {

    mapboxgl.accessToken = key.key;
    window.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-104.9, 39.75],
      zoom: 9,
      maxZoom: 12,
      minZoom: 4,
      preserveDrawingBuffer: true
    });

    window.map.on('load', () => {

      const updateTiles = _.debounce(() => {

        // get all geoids
        const features = window.map.queryRenderedFeatures({ layers: ['tiles-polygons'] });
        const geoids = features.map(d => {
          return d.properties.GEOID;
        });

        this.props.updateGeoids(Array.from(new Set(geoids)));
      }, 300);

      window.map.addSource('tiles', {
        "type": "vector",
        "tiles": [`https://s3-us-west-2.amazonaws.com/static-tiles/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}/{z}/{x}/{y}.pbf`]
      });

      window.map.addLayer({
        'id': 'tiles-polygons',
        'type': 'fill',
        'source': 'tiles',
        'source-layer': 'main',
        'paint': {
          'fill-color': 'green',
          'fill-opacity': 0.75
        }
      }, "admin-2-boundaries-dispute");

      window.map.addLayer({
        'id': 'tiles-lines',
        'type': 'line',
        'source': 'tiles',
        'source-layer': 'main',
        'paint': {
          'line-color': 'yellow',
          'line-width': 1,
          'line-offset': 0.5
        }
      }, "admin-2-boundaries-dispute");

      window.map.on('data', (e) => {
        if (e.isSourceLoaded && (e.sourceId === 'tiles')) {
          updateTiles();
        }
      });

      window.map.on('moveend', (e) => {
        updateTiles();
      });

    });



  }




  shouldComponentUpdate(nextProps, nextState) {
    // redraw layer on redux style change

    let redraw = false;


    if (this.props.source_geography !== nextProps.source_geography || this.props.source_dataset !== nextProps.source_dataset) {
      console.log('changing due to geography or dataset');
      // geography or year changed.  update source and redraw
      window.map.removeSource('tiles');
      window.map.addSource('tiles', {
        "type": "vector",
        "tiles": [`https://s3-us-west-2.amazonaws.com/static-tiles/${this.props.source_geography}_${datasetToYear(this.props.source_dataset)}/{z}/{x}/{y}.pbf`]
      });
      redraw = true;
    }


    if (this.props.polygon_stops !== nextProps.polygon_stops) {
      // visible area on the map changed
      console.log('changing due to polygon stops');
      redraw = true;
    }


    // TODO debounce?
    if (redraw) {
      console.log('redrawing');

      // Update Shape Layer
      window.map.setPaintProperty('tiles-polygons', 'fill-color', {
        property: 'GEOID',
        type: 'categorical',
        stops: nextProps.polygon_stops
      });

      // Update Outline Layer
      window.map.setPaintProperty('tiles-lines', 'line-color', {
        property: 'GEOID',
        type: 'categorical',
        stops: nextProps.polygon_stops
      });

    }

    return false;
  }

  render() {
    return <div id="map" />;
  }
}


export default Map;
