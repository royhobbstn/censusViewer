/* global fetch */

import React, { Component } from 'react';
import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { key } from './mapbox_api_key.js';
import { style } from '../Config/style.js';
import { configuration } from '../Config/configuration.js';

import { formatNumber } from '../Service/utility.js';
import { loadMapLayers } from '../Service/load_map_layers.js';
import { loadMouseEvents } from '../Service/load_mouse_events.js';



class Map extends Component {


  getCurrentData = ()=> {
    return {
      source_geography: this.props.source_geography,
      source_dataset: this.props.source_dataset,
      tiles_already_requested: this.props.tiles_already_requested
    };
  }

  componentDidMount() {

    mapboxgl.accessToken = key;
    window.map = new mapboxgl.Map({
      container: 'map',
      style,
      center: [-104.9, 39.75],
      zoom: configuration.startup.zoom,
      maxZoom: 13,
      minZoom: 3
    });

    window.map.on('load', () => {

      loadMapLayers(this.props.source_geography, this.props.source_dataset);

      loadMouseEvents(this.getCurrentData, this.props.addToRequested, this.props.updateClusters, this.props.updateMouseover, this.props.updateZoomMessage);

      window.map.on('error', event => console.log(event));

    });

  }



  shouldComponentUpdate(nextProps, nextState) {

    // redraw layer on theme / geo / dataset change
    if (this.props.source_geography !== nextProps.source_geography || this.props.source_dataset !== nextProps.source_dataset || this.props.selected_attr !== nextProps.selected_attr) {
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
