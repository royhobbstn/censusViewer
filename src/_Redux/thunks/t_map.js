/* global fetch */

import { updateStyleData, updateMoeData, changeMouseover, addToInProgressList, addToMoeInProgressList, removeFromInProgressList, removeFromMoeInProgressList } from '../actions/a_map.js';

import { datatree } from '../../_Config_JSON/datatree.js';
import localforage from "localforage";

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


export function thunkUpdateClusters(clusters) {
  return (dispatch, getState) => {

    const state = getState();

    const source_dataset = state.map.source_dataset;
    const sumlev = getSumlevFromGeography(state.map.source_geography);
    const attr = state.map.selected_attr;

    const in_progress_cluster_list = state.map.in_progress_cluster_list;
    const cluster_done_list = state.map.cluster_done_list;

    const in_progress_moe_cluster_list = state.map.in_progress_moe_cluster_list;
    const moe_cluster_done_list = state.map.moe_cluster_done_list;

    // clusters_to_get = clusters - in_progress_cluster_list - cluster_done_list
    const clusters_to_get = clusters.filter(cluster => {
      const in_progress = in_progress_cluster_list.includes(cluster);
      const already_done = cluster_done_list.includes(cluster);
      return !(in_progress || already_done);
    });

    // same logic for MOE
    const moe_clusters_to_get = clusters.filter(cluster => {
      const in_progress = in_progress_moe_cluster_list.includes(cluster);
      const already_done = moe_cluster_done_list.includes(cluster);
      return !(in_progress || already_done);
    });

    if (clusters_to_get.length > 0) {
      console.log(clusters_to_get);

      dispatch(addToInProgressList(clusters_to_get));

      const expression = encodeURIComponent(JSON.stringify(getExpressionFromAttr(source_dataset, attr)));
      const clusters_to_get_encoded = encodeURIComponent(JSON.stringify(clusters_to_get));

      const url = `https://34suzrhb22.execute-api.us-west-2.amazonaws.com/dev/retrieve?expression=${expression}&dataset=${source_dataset}&sumlev=${sumlev}&clusters=${clusters_to_get_encoded}`;

      return fetch(url)
        .then(res => res.json())
        .then(fetched_data => {

          // updates style, removes from clusters-in-progress, adds to clusters-done
          dispatch(updateStyleData(fetched_data, clusters_to_get));

        })
        .catch(err => {
          console.error('err:', err);
          // removes from clusters-in-progress
          dispatch(removeFromInProgressList(clusters_to_get));
        });
    }

    if (moe_clusters_to_get.length > 0) {
      dispatch(addToMoeInProgressList(moe_clusters_to_get));

      const moe_expression = encodeURIComponent(JSON.stringify(getMoeExpressionFromAttr(source_dataset, attr)));
      const moe_clusters_to_get_encoded = encodeURIComponent(JSON.stringify(moe_clusters_to_get));

      const url = `https://34suzrhb22.execute-api.us-west-2.amazonaws.com/dev/retrieve?expression=${moe_expression}&dataset=${source_dataset}&sumlev=${sumlev}&clusters=${moe_clusters_to_get_encoded}&moe=true`;

      return fetch(url)
        .then(res => res.json())
        .then(fetched_data => {

          // updates style, removes from clusters-in-progress, adds to clusters-done
          dispatch(updateMoeData(fetched_data, moe_clusters_to_get));

        })
        .catch(err => {
          console.error('err:', err);
          // removes from clusters-in-progress
          dispatch(removeFromMoeInProgressList(moe_clusters_to_get));
        });
    }

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
