/* global fetch TextDecoder*/

import { updateStyleData, changeMouseover, addToInProgressList, removeFromInProgressList, clustersNowDone } from '../actions/a_map.js';

import { datatree } from '../../_Config_JSON/datatree.mjs';
import localforage from "localforage";
// import workerize from 'workerize';

// const worker = workerize(`
//                 export function num() {
//                     return 5;
//                 };
// 				export function get(url) {
// 					return fetch(location.origin+'/'+url).then(asJson);
// 				}
// 				function asJson(res) {
// 					return res.json();
// 				}
// 			`, { type: 'module' });

// worker.num().then(pkg => {
//     console.log('Got package name: ', pkg);
// });

localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'CensusWebmap'
});

window.key_store = {};

export function thunkChangeMouseover(geoid, name) {
  return (dispatch, getState) => {
    // acs1115:mhi:05000US08005:63265
    // acs1115:mhi:05000US08005_moe:942

    const state = getState();
    const source_dataset = state.map.source_dataset;
    const sumlev = getSumlevFromGeography(state.map.source_geography);
    const attr = state.map.selected_attr;

    const formatted_geoid = `${source_dataset}:${attr}:${sumlev}00US${geoid}`;

    const obj = {
      mouseover_statistic: window.key_store[formatted_geoid],
      mouseover_label: name,
      mouseover_moe: window.key_store[formatted_geoid + '_moe']
    };

    dispatch(changeMouseover(obj));

  };
}


export function thunkUpdateClusters(clusters) {
  return (dispatch, getState) => {

    const state = getState();

    const source_dataset = state.map.source_dataset;
    const sumlev = getSumlevFromGeography(state.map.source_geography);
    const attr = state.map.selected_attr;
    const in_progress_cluster_list = state.map.in_progress_cluster_list;
    const cluster_done_list = state.map.cluster_done_list;

    // clusters_to_get = clusters - in_progress_cluster_list - cluster_done_list
    const clusters_to_get = clusters.filter(cluster => {

      const in_progress = in_progress_cluster_list.includes(cluster);
      const already_done = cluster_done_list.includes(cluster);

      return !(in_progress || already_done);
    });

    if (clusters_to_get.length === 0) {
      // no clusters to get.  short circuit out of here
      return;
    }

    dispatch(addToInProgressList(clusters_to_get));

    const expression = encodeURIComponent(JSON.stringify(getExpressionFromAttr(source_dataset, attr)));
    const clusters_to_get_encoded = encodeURIComponent(JSON.stringify(clusters_to_get));

    const url = `https://d0ahqlmxvi.execute-api.us-west-2.amazonaws.com/dev/retrieve?expression=${expression}&dataset=${source_dataset}&sumlev=${sumlev}&clusters=${clusters_to_get_encoded}`;

    return fetch(url)
      .then(res => res.json())
      .then(fetched_data => {

        // convert the raw numbers to colors for styling
        const stops = convertDataToStops(fetched_data);

        // updates style, removes from clusters-in-progress, adds to clusters-done
        dispatch(updateStyleData(stops, clusters_to_get));

      })
      .catch(err => {
        console.error('err:', err);
        // removes from clusters-in-progress
        dispatch(removeFromInProgressList(clusters_to_get));
      });


  };

}






function getExpressionFromAttr(dataset, attr) {
  const numerator_raw = datatree[dataset][attr].numerator;
  const denominator_raw = datatree[dataset][attr].denominator;

  const numerator = [];
  numerator_raw.forEach((item, index) => {
    numerator.push(item);
    if (index !== numerator_raw.length - 1) { numerator.push("+"); }
  });

  const denominator = [];
  denominator_raw.forEach((item, index) => {
    denominator.push(item);
    if (index !== denominator_raw.length - 1) { denominator.push("+"); }
  });
  if (!denominator.length) {
    denominator.push("1");
  }

  return ["(", ...numerator, ")", "/", "(", ...denominator, ")"];
}

function getMoeExpressionFromAttr(dataset, attr) {
  // TODO this needs to be validated

  const numerator_raw = datatree[dataset][attr].numerator;
  const denominator_raw = datatree[dataset][attr].denominator;

  // escape hatch.  todo, re-examine moe calculation
  if (numerator_raw.length === 1 && denominator_raw.length === 0) {
    return [numerator_raw[0] + '_moe'];
  }

  const numerator = [];
  numerator_raw.forEach((item, index) => {
    numerator.push(item);
    if (index !== numerator_raw.length - 1) { numerator.push("+"); }
  });

  const denominator = [];
  denominator_raw.forEach((item, index) => {
    denominator.push(item);
    if (index !== denominator_raw.length - 1) { denominator.push("+"); }
  });
  if (!denominator.length) {
    denominator.push("1");
  }

  const numerator_moe = ["sqrt", "("];
  numerator_raw.forEach((item, index) => {
    numerator_moe.push("(");
    numerator_moe.push(item + '_moe');
    numerator_moe.push("^");
    numerator_moe.push("2");
    numerator_moe.push(")");
    if (index !== numerator_raw.length - 1) { numerator_moe.push("+"); }
  });
  numerator_moe.push(")");

  const denominator_moe = ["sqrt", "("];
  denominator_raw.forEach((item, index) => {
    denominator_moe.push("(");
    denominator_moe.push(item + '_moe');
    denominator_moe.push("^");
    denominator_moe.push("2");
    denominator_moe.push(")");
    if (index !== denominator_raw.length - 1) { denominator_moe.push("+"); }
  });
  if (!denominator_raw.length) {
    denominator_moe.push("1");
  }
  denominator_moe.push(")");

  console.log(["(", "sqrt", "(", "(", "(", ...numerator_moe, ")", "^", "2", ")", "-", "(", "(", "(", "(", ...numerator, ")", "/", "(", ...denominator, ")", ")", "^", "2", ")", "*", "(", "(", ...denominator_moe, ")", "^", "2", ")", ")", ")", ")", "/", "(", ...denominator, ")"]);

  return ["(", "sqrt", "(", "(", "(", ...numerator_moe, ")", "^", "2", ")", "-", "(", "(", "(", "(", ...numerator, ")", "/", "(", ...denominator, ")", ")", "^", "2", ")", "*", "(", "(", ...denominator_moe, ")", "^", "2", ")", ")", ")", ")", "/", "(", ...denominator, ")"];
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
  if (!value) {
    return 'black';
  }

  if (value > 100000) {
    return 'green';
  }
  else if (value > 60000) {
    return 'yellow';
  }
  else if (value > 40000) {
    return 'orange';
  }
  else {
    return 'red';
  }
}

function getSumlevFromGeography(geography) {
  switch (geography) {
    case 'county':
      return '050';
    case 'state':
      return '040';
    case 'tract':
      return '140';
    case 'bg':
      return '150';
    case 'place':
      return '160';
    default:
      return '000';
  }
}

function getKeyFromGeoid(geoids) {
  return geoids.map(d => {
    // state = 2 characters (state[2])
    // county = 5 characters (state[2]|county[3])
    // place - 7 characters (state[2]|place[5])
    // tract = 11 characters (state[2]|county[3]|tract[6])
    // bg = 12 characters (state[2]|county[3]|tract[6]|bg[1])

    // return proper s3 file
    const len = d.length;
    const state = d.slice(0, 2);
    const statecounty = d.slice(0, 5);

    switch (len) {
      case 2:
        return `/040/${state}`;
      case 5:
        return `/050/${state}`;
      case 7:
        return `/160/${state}`;
      case 11:
        return `/140/${statecounty}`;
      case 12:
        return `/150/${statecounty}`;
      default:
        console.error(`unexpected geoid: ${d}`);
        return '';
    }

  });
}
