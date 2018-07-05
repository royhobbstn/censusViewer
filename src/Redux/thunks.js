/* global fetch */

import { point } from '@turf/helpers';
import buffer from '@turf/buffer';
import booleanWithin from '@turf/boolean-within';

import {
  busyData,
  busyMoe,
  changeMouseoverInfo,
  clearActiveLayerNames
}
from './actions.js';

import LZ from 'lz-string';

import { configuration } from '../Config/configuration.js';


import {
  getMoeExpressionFromAttr,
  getExpressionFromAttr
}
from '../Service/calc_expressions.js';

import { getSumlevFromGeography } from '../Service/utility.js';

import { myMoeWorker } from '../Worker/handle_moe_fetch.js';
import { myEstWorker } from '../Worker/handle_est_fetch.js';


export function thunkClearWorkers(geoid, name) {
  return (dispatch, getState) => {
    myEstWorker.postMessage({ type: 'clear', data: {} });
    myMoeWorker.postMessage({ type: 'clear', data: {} });
  };
}

export function thunkChangeMouseover(geoid, name, coords) {
  return (dispatch, getState) => {
    myEstWorker.postMessage({ type: 'lookup', data: geoid });
    myMoeWorker.postMessage({ type: 'lookup', data: geoid });
    dispatch(changeMouseoverInfo(name, coords));
  };
}

export function thunkRemoveLayers() {
  return (dispatch, getState) => {

    console.log('REMOVING LAYERS');

    const state = getState();
    const source_geography = state.map.source_geography;
    const source_dataset = state.map.source_dataset;
    const active_layer_names = state.map.active_layer_names;

    const year = configuration.datasets[source_dataset].year;

    window.map.removeLayer('tiles-polygons');

    active_layer_names.forEach(layer => {
      window.map.removeLayer(layer);
      window.map.removeLayer(layer + '_line');
    });

    dispatch(clearActiveLayerNames());

    window.map.removeSource('tiles');

    window.map.addSource('tiles', {
      "type": "vector",
      "minzoom": 3,
      "maxzoom": 9,
      "tiles": [`https://${configuration.tiles[0]}/${source_geography}_${year}/{z}/{x}/{y}.pbf`, `https://${configuration.tiles[1]}/${source_geography}_${year}/{z}/{x}/{y}.pbf`, `https://${configuration.tiles[2]}/${source_geography}_${year}/{z}/{x}/{y}.pbf`]
    });

    // layer is re-added because source changed
    window.map.addLayer({
      'id': 'tiles-polygons',
      'type': 'fill',
      'source': 'tiles',
      'source-layer': 'main',
    }, "background");


    // initiate redraw of map tiles
    window.map.fire('redraw');
  };
}


export function thunkUpdateClusters(pole, current_zoom, current_bounds) {
  return (dispatch, getState) => {

    const state = getState();

    const source_dataset = state.map.source_dataset;
    const sumlev = getSumlevFromGeography(state.map.source_geography);
    const attr = state.map.selected_attr;
    const pole_list = state.map.pole_list;


    // determine if it is a new pole - start with 1 mile and adjust as needed
    const pt = point([pole.lng, pole.lat]);
    const pt_buffer = buffer(pt, 1, { units: 'miles' });

    const already_processed_pole = pole_list.some(p => {
      const test_pt = point([p.lng, p.lat]);
      return booleanWithin(test_pt, pt_buffer);
    });

    console.log({ already_processed_pole });

    if (already_processed_pole) {
      return;
    }

    // need to keep track of clusters already retrieved on client and send that information to lambda
    // lambda will figure out clusters to get
    const cluster_done_list = LZ.compressToEncodedURIComponent(JSON.stringify(state.map.cluster_done_list));
    const moe_cluster_done_list = LZ.compressToEncodedURIComponent(JSON.stringify(state.map.moe_cluster_done_list));

    const expression = encodeURIComponent(JSON.stringify(getExpressionFromAttr(source_dataset, attr)));
    const bounds = encodeURIComponent(JSON.stringify(current_bounds));

    // draw the pole... demo only, not for live
    window.map.getSource('point').setData({
      "type": "Point",
      "coordinates": [pole.lng, pole.lat]
    });

    const root = 'https://34suzrhb22.execute-api.us-west-2.amazonaws.com/dev/retrieve?';
    const url = `${root}theme=${attr}&expression=${expression}&dataset=${source_dataset}&sumlev=${sumlev}&pole_lat=${pole.lat}&pole_lng=${pole.lng}&current_zoom=${current_zoom}&current_bounds=${bounds}&cluster_done_list=${cluster_done_list}`;

    if (!state.map.busy_data) {
      dispatch(busyData({ lng: pole.lng, lat: pole.lat }));
      myEstWorker.postMessage({ type: 'fetch', url: url, attr, source_dataset, sumlev });
    }

    const moe_expression = encodeURIComponent(JSON.stringify(getMoeExpressionFromAttr(source_dataset, attr)));
    const moe_url = `${root}theme=${attr}&expression=${moe_expression}&dataset=${source_dataset}&sumlev=${sumlev}&pole_lat=${pole.lat}&pole_lng=${pole.lng}&current_zoom=${current_zoom}&current_bounds=${bounds}&cluster_done_list=${moe_cluster_done_list}&moe=true`;

    if (!state.map.busy_moe) {
      dispatch(busyMoe());
      myMoeWorker.postMessage({ type: 'fetch', url: moe_url });
    }

  };
}
