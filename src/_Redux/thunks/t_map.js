/* global fetch */

import { updateStyleData, updateMoeData, changeMouseover } from '../actions/a_map.js';
import LZ from 'lz-string';
import { datatree } from '../../_Config_JSON/datatree.js';
import localforage from "localforage";

// TODO
localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'CensusWebmap'
});

window.key_store = {};

export function thunkChangeMouseover(geoid, name) {
  return (dispatch, getState) => {

    const state = getState();
    const obj = {
      mouseover_statistic: state.map.polygon_stops[geoid],
      mouseover_label: name,
      mouseover_moe: state.map.moe_stops[geoid]
    };

    dispatch(changeMouseover(obj));
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

    // const root = 'http://34.208.116.122:8081/retrieve?';
    const root = 'https://34suzrhb22.execute-api.us-west-2.amazonaws.com/dev/retrieve?';

    const url = `${root}expression=${expression}&dataset=${source_dataset}&sumlev=${sumlev}&pole_lat=${pole.lat}&pole_lng=${pole.lng}&current_zoom=${current_zoom}&current_bounds=${bounds}&cluster_done_list=${cluster_done_list}`;

    fetch(url)
      .then(res => res.json())
      .then(fetched_data => {
        console.log(fetched_data);

        // updates style, removes from clusters-in-progress, adds to clusters-done
        if (Object.keys(fetched_data.data).length) {
          dispatch(updateStyleData(fetched_data.data, fetched_data.clusters));
        }

      })
      .catch(err => {
        console.error('err:', err);
      });


    const moe_expression = encodeURIComponent(JSON.stringify(getMoeExpressionFromAttr(source_dataset, attr)));

    const moe_url = `${root}expression=${moe_expression}&dataset=${source_dataset}&sumlev=${sumlev}&pole_lat=${pole.lat}&pole_lng=${pole.lng}&current_zoom=${current_zoom}&current_bounds=${bounds}&cluster_done_list=${moe_cluster_done_list}&moe=true`;

    fetch(moe_url)
      .then(res => res.json())
      .then(fetched_data => {

        // updates style, removes from clusters-in-progress, adds to clusters-done
        if (Object.keys(fetched_data.data).length) {
          dispatch(updateMoeData(fetched_data.data, fetched_data.clusters));
        }

      })
      .catch(err => {
        console.error('err:', err);
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
