/* global fetch */

import React, { Component } from 'react';
import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import key from './mapbox_api_key.js';


class Map extends Component {
  componentDidMount() {

    mapboxgl.accessToken = key.key;
    window.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [-104.9, 39.75],
      zoom: 9,
      maxZoom: 10,
      minZoom: 7,
      preserveDrawingBuffer: true
    });

    window.map.on('load', () => {
      window.map.addSource('tiles', this.props.polygon_source);
      window.map.addLayer({
        'id': 'tiles-polygons',
        'type': 'fill',
        'source': 'tiles',
        'source-layer': 'placegeojson',
        'paint': {
          'fill-color': 'green',
          'fill-opacity': 0.75
        }
      }, "admin-2-boundaries-dispute");
    });

    window.map.on('moveend', (e, f) => {
      console.log('moveend');
    });

  }

  shouldComponentUpdate(nextProps, nextState) {
    // redraw layer on redux style change

    if (this.props.polygon_stops !== nextProps.polygon_stops) {
      console.log('redrawing');
      console.log(nextProps.polygon_stops);
      window.map.setPaintProperty('tiles-polygons', 'fill-color', {
        property: 'geoid',
        type: 'categorical',
        stops: nextProps.polygon_stops
      });

      // TODO
      // window.map.setPaintProperty('tiles-polygons', 'fill-outline-color', {
      //   property: 'geoid',
      //   type: 'categorical',
      //   stops: nextProps.polygon_stops
      // });

    }

    return false;
  }

  render() {
    return <div id="map" />;
  }
}

export default Map;
