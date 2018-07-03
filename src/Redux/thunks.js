/* global fetch */

import {
  updateStyleData,
  updateMoeData,
  busyData,
  busyMoe,
  unbusyData,
  unbusyMoe,
  changeMouseoverStatistic,
  changeMouseoverInfo,
  changeMouseoverMoe,
  clearActiveLayerNames
}
from './actions.js';

import LZ from 'lz-string';

import worker_script from '../Worker/fetch_worker.js';
import { configuration } from '../Config/configuration.js';

import { convertDataToStops } from '../Service/data_to_styles.js';

import {
  getMoeExpressionFromAttr,
  getExpressionFromAttr
}
from '../Service/calc_expressions.js';

import { getSumlevFromGeography } from '../Service/utility.js';

var myEstWorker = new Worker(worker_script);
var myMoeWorker = new Worker(worker_script);

// give a unique increment id number to each new layer created
let layer_add = 0;


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

    window.map.addLayer({
      'id': 'tiles-polygons',
      'type': 'fill',
      'source': 'tiles',
      'source-layer': 'main',
    }, "background");
  };
}


export function thunkUpdateClusters(pole, current_zoom, current_bounds) {
  return (dispatch, getState) => {

    const state = getState();

    const source_dataset = state.map.source_dataset;
    const sumlev = getSumlevFromGeography(state.map.source_geography);
    const attr = state.map.selected_attr;

    // need to keep track of clusters already retrieved on client and send that information to lambda
    // lambda will figure out clusters to get
    const cluster_done_list = LZ.compressToEncodedURIComponent(JSON.stringify(state.map.cluster_done_list));
    const moe_cluster_done_list = LZ.compressToEncodedURIComponent(JSON.stringify(state.map.moe_cluster_done_list));


    const expression = encodeURIComponent(JSON.stringify(getExpressionFromAttr(source_dataset, attr)));
    const bounds = encodeURIComponent(JSON.stringify(current_bounds));


    // const root = 'http://34.211.152.253:8081/retrieve?';
    const root = 'https://34suzrhb22.execute-api.us-west-2.amazonaws.com/dev/retrieve?';

    const url = `${root}theme=${attr}&expression=${expression}&dataset=${source_dataset}&sumlev=${sumlev}&pole_lat=${pole.lat}&pole_lng=${pole.lng}&current_zoom=${current_zoom}&current_bounds=${bounds}&cluster_done_list=${cluster_done_list}`;


    if (!myEstWorker.onmessage) {
      myEstWorker.onmessage = (m) => {

        if (!m || !m.data) {
          dispatch(unbusyData());
        }
        else {

          if (m.data.type === 'fetch') {

            layer_add++;

            console.time('start');
            console.time('start1');
            console.time('start2');
            console.time('start3');

            // TODO lift this calculation to a worker
            const values = convertDataToStops(m.data.data.data, m.data.attr, m.data.source_dataset, m.data.sumlev);
            console.timeEnd('start1');

            const unique_geoids = Object.keys(values);

            console.timeEnd('start2');


            const stops = unique_geoids.map(key => {
              return [key, values[key]];
            });

            console.timeEnd('start3');


            // to avoid 'must have stops' errors
            const drawn_stops = (stops.length) ? stops : [
              ["0", 'blue']
            ];

            console.timeEnd('start');

            const new_layer_name = `tiles-polygons-${layer_add}`;

            window.map.addLayer({
              'id': new_layer_name,
              'type': 'fill',
              'source': 'tiles',
              'source-layer': 'main',
              filter: ['in', 'GEOID', ...unique_geoids],
              'paint': {
                'fill-antialias': false,
                'fill-opacity': 0.6,
                'fill-color': {
                  property: 'GEOID',
                  type: 'categorical',
                  stops: drawn_stops
                }
              }
            }, "blank");

            window.map.addLayer({
              'id': new_layer_name + '_line',
              'type': 'line',
              'source': 'tiles',
              'source-layer': 'main',
              filter: ['in', 'GEOID', ...unique_geoids],
              'paint': {
                'line-opacity': 0.8,
                'line-width': 0.5,
                'line-offset': 0.25,
                'line-color': {
                  property: 'GEOID',
                  type: 'categorical',
                  stops: drawn_stops
                }
              }
            }, "blank");

            dispatch(updateStyleData(m.data.data.clusters, new_layer_name));

          }
          else if (m.data.type === 'lookup') {
            dispatch(changeMouseoverStatistic(m.data.data));
          }
        }

      };
    }


    if (!state.map.busy_data) {
      dispatch(busyData());
      myEstWorker.postMessage({ type: 'fetch', url: url, attr, source_dataset, sumlev });
    }

    const moe_expression = encodeURIComponent(JSON.stringify(getMoeExpressionFromAttr(source_dataset, attr)));

    const moe_url = `${root}theme=${attr}&expression=${moe_expression}&dataset=${source_dataset}&sumlev=${sumlev}&pole_lat=${pole.lat}&pole_lng=${pole.lng}&current_zoom=${current_zoom}&current_bounds=${bounds}&cluster_done_list=${moe_cluster_done_list}&moe=true`;



    if (!state.map.busy_moe) {
      dispatch(busyMoe());

      if (!myMoeWorker.onmessage) {
        myMoeWorker.onmessage = (m) => {

          if (!m || !m.data) {
            dispatch(unbusyMoe());
          }
          else {
            if (m.data.type === 'fetch') {
              dispatch(updateMoeData(m.data.data.clusters));
            }
            else if (m.data.type === 'lookup') {
              dispatch(changeMouseoverMoe(m.data.data));
            }
          }
        };

      }

      myMoeWorker.postMessage({ type: 'fetch', url: moe_url });

    }

  };
}
